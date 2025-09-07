const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../index');
const User = require('../../src/models/user.model');
const jwt = require('jsonwebtoken');

let mongod;

describe('/users - Integration Tests', () => {
    let token;

    beforeAll(async () => {
        await mongoose.disconnect();

        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
    }, 30000);

    beforeEach(async () => {
        await User.deleteMany({});
        const testUser = await User.create({ name: 'Auth User', email: 'auth@example.com' });
        token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongod.stop();
    });

    describe('POST /users', () => {
        it('should return 401 Unauthorized if no token is provided', async () => {
            await request(app).post('/users').send({ name: 'Test', email: 'test@example.com' }).expect(401);
        });

        it('should create a user and return 201 if the token is valid', async () => {
            const newUser = { name: 'New User', email: 'new@example.com', age: 25 };
            const res = await request(app).post('/users').set('Authorization', `Bearer ${token}`).send(newUser).expect(201);

            expect(res.body.status).toBe('success');
            expect(res.body.data.user.email).toBe('new@example.com');
        });

        it('should return 409 Conflict if the email already exists', async () => {
            const existingUser = { name: 'Existing User', email: 'auth@example.com' };
            await request(app).post('/users').set('Authorization', `Bearer ${token}`).send(existingUser).expect(409);
        });
    });

    describe('GET /users', () => {
        it('should return all users for an authenticated request', async () => {
            await User.create({ name: 'Second User', email: 'second@example.com' });
            const res = await request(app).get('/users').set('Authorization', `Bearer ${token}`).expect(200);

            expect(res.body.status).toBe('success');
            expect(Array.isArray(res.body.data.users)).toBe(true);
            expect(res.body.results).toBe(2);
        });
    });

    describe('GET /users/:id', () => {
        it('should return a single user if the ID is valid', async () => {
            const user = await User.findOne({ email: 'auth@example.com' });
            const res = await request(app).get(`/users/${user._id}`).set('Authorization', `Bearer ${token}`).expect(200);

            expect(res.body.data.user.name).toBe('Auth User');
        });

        it('should return 404 Not Found if the user ID does not exist', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            await request(app).get(`/users/${nonExistentId}`).set('Authorization', `Bearer ${token}`).expect(404);
        });
    });

    describe('PUT /users/:id', () => {
        it('should update the user and return 200', async () => {
            const user = await User.findOne({ email: 'auth@example.com' });
            const updateData = { name: 'Updated Auth User' };
            const res = await request(app).put(`/users/${user._id}`).set('Authorization', `Bearer ${token}`).send(updateData).expect(200);

            expect(res.body.data.user.name).toBe('Updated Auth User');
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete the user and return 200 with a success message', async () => {
            const userToDelete = await User.create({ name: 'To Delete', email: 'delete@me.com' });
            const res = await request(app).delete(`/users/${userToDelete._id}`).set('Authorization', `Bearer ${token}`).expect(200);

            expect(res.body.message).toContain('deleted successfully');

            const deletedUser = await User.findById(userToDelete._id);
            expect(deletedUser).toBeNull();
        });
    });
});