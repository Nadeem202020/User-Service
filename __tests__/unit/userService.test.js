const userService = require('../../src/services/userService');
const User = require('../../src/models/user.model');
const AppError = require('../../src/utils/AppError');

jest.mock('../../src/models/user.model');

describe('User Service - Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should create and return a new user if the email is unique', async () => {
            const userData = { name: 'Test User', email: 'test@example.com' };
            const savedUser = { _id: 'someId', ...userData };

            User.findOne.mockResolvedValue(null);
            User.prototype.save.mockResolvedValue(savedUser);

            const result = await userService.createUser(userData);

            expect(result).toBeDefined();
            expect(result.email).toBe(userData.email);
            expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
            expect(User.prototype.save).toHaveBeenCalledTimes(1);
        });

        it('should throw a 409 error if the email already exists', async () => {
            const userData = { name: 'Test User', email: 'test@example.com' };
            User.findOne.mockResolvedValue(userData);

            await expect(userService.createUser(userData)).rejects.toThrow(AppError);
            await expect(userService.createUser(userData)).rejects.toMatchObject({
                statusCode: 409,
                message: 'An account with this email already exists.',
            });
            expect(User.prototype.save).not.toHaveBeenCalled();
        });
    });

    describe('getUserById', () => {
        it('should return a user if found', async () => {
            const userId = 'validId';
            const mockUser = { _id: userId, name: 'Found User', email: 'found@example.com' };
            User.findById.mockResolvedValue(mockUser);

            const result = await userService.getUserById(userId);

            expect(result).toEqual(mockUser);
            expect(User.findById).toHaveBeenCalledWith(userId);
        });

        it('should throw a 404 error if the user is not found', async () => {
            const userId = 'invalidId';
            User.findById.mockResolvedValue(null);

            await expect(userService.getUserById(userId)).rejects.toThrow(AppError);
            await expect(userService.getUserById(userId)).rejects.toMatchObject({
                statusCode: 404,
            });
        });
    });

    describe('updateUser', () => {
        it('should update and return the user without changing the email', async () => {
            const userId = 'validId';
            const updateData = { name: 'New Name' };
            const updatedUserDoc = { _id: userId, name: 'New Name', email: 'test@example.com' };

            User.findByIdAndUpdate.mockResolvedValue(updatedUserDoc);

            const result = await userService.updateUser(userId, updateData);

            expect(result.name).toBe('New Name');
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, updateData, { new: true, runValidators: true });
        });

        it('should throw a 409 error if the new email is already taken', async () => {
            const userId = 'validId';
            const updateData = { email: 'taken@example.com' };

            User.findOne.mockResolvedValue({ _id: 'anotherId', email: 'taken@example.com' });

            await expect(userService.updateUser(userId, updateData)).rejects.toThrow(AppError);
            await expect(userService.updateUser(userId, updateData)).rejects.toMatchObject({
                statusCode: 409,
            });
            expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
        });
    });

    describe('deleteUser', () => {
        it('should delete a user successfully', async () => {
            const userId = 'validId';
            User.findByIdAndDelete.mockResolvedValue({ _id: userId });

            await expect(userService.deleteUser(userId)).resolves.not.toThrow();
            expect(User.findByIdAndDelete).toHaveBeenCalledWith(userId);
        });

        it('should throw a 404 error if the user to delete is not found', async () => {
            const userId = 'invalidId';
            User.findByIdAndDelete.mockResolvedValue(null);

            await expect(userService.deleteUser(userId)).rejects.toThrow(AppError);
            await expect(userService.deleteUser(userId)).rejects.toMatchObject({
                statusCode: 404,
            });
        });
    });
});