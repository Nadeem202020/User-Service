# Task 2: Dynamic Delivery Slot Allocation Pseudocode

This document outlines the detailed logic for a backend system that handles dynamic booking of delivery slots, ensuring no overbooking and providing real-time feedback.

---

## 1. Data Structures

First, we define the necessary data models. These would likely be collections in a NoSQL database like MongoDB.

```pseudocode
// Represents a single delivery slot for a given day.
DATA_STRUCTURE DeliverySlot:
    slotId: String
    startTime: DateTime
    endTime: DateTime
    capacity: Integer
    bookedCount: Integer

// Represents a confirmed booking by a user for a slot.
DATA_STRUCTURE Booking:
    bookingId: String
    orderId: String
    userId: String
    slotId: String
    createdAt: DateTime
```

---

## 2. Core Functions

### FUNCTION: `getAvailableSlots(date)`

**Objective:** To fetch all slots for a given day that are not yet full. This is used to display available slots to the customer.

```pseudocode
FUNCTION getAvailableSlots(date):
    // 1. Determine the start and end of the given date.
    startOfDay = date at 00:00:00
    endOfDay = date at 23:59:59

    // 2. Query the database for slots within that date range where capacity has not been reached.
    availableSlots = DATABASE.find(DeliverySlot, {
        startTime >= startOfDay AND
        startTime <= endOfDay AND
        bookedCount < capacity
    })

    // 3. Return the list of available slots for the frontend to render.
    RETURN availableSlots
END FUNCTION
```

---

### FUNCTION: `bookDeliverySlot(userId, orderId, desiredSlotId)`

**Objective:** To atomically book a preferred slot. This is the most critical part of the logic, as it must handle race conditions to prevent overbooking.

```pseudocode
FUNCTION bookDeliverySlot(userId, orderId, desiredSlotId):
    // 1. Use an ATOMIC database "find and update" operation.
    updateResult = DATABASE.findAndModify(DeliverySlot,
        query = {
            slotId: desiredSlotId,
            bookedCount: { $lt: capacity }
        },
        update = {
            $inc: { bookedCount: 1 }
        },
        returnNewDocument = true
    )

    // 2. Check the result of the atomic operation.
    IF updateResult is NULL or EMPTY:
        // Slot invalid or already full (race condition case).
        alternatives = suggestAlternativeSlots(today_or_relevant_date)

        RETURN {
            success: false,
            message: "Sorry, the selected slot is now full. Please choose another.",
            suggestedSlots: alternatives
        }
    ELSE:
        // Atomic increment successful → create booking record.
        newBooking = CREATE new Booking({
            orderId: orderId,
            userId: userId,
            slotId: desiredSlotId
        })
        DATABASE.save(newBooking)

        RETURN {
            success: true,
            message: "Delivery slot confirmed!",
            bookedSlot: updateResult
        }
    END IF
END FUNCTION
```

---

### FUNCTION: `suggestAlternativeSlots(date)`

**Objective:** A helper function to find other available slots if the user's preferred choice is unavailable.

```pseudocode
FUNCTION suggestAlternativeSlots(date):
    // Reuse getAvailableSlots() logic.
    availableSlots = getAvailableSlots(date)

    // Return a limited number of suggestions (e.g., next 3).
    RETURN first 3 slots from availableSlots
END FUNCTION
```
