const FlightSchedule = require('../model/FlightSchedule');

const cleanupExpiredSeats = async () => {
    const now = new Date();

    try {
        await FlightSchedule.updateMany(
            { "SeatAvailability.status": "selected", "SeatAvailability.expiresAt": { $lt: now } },
            {
                $set: { "SeatAvailability.$[seat].status": "available" },
                $unset: { "SeatAvailability.$[seat].expiresAt": "" }
            },
            { arrayFilters: [{ "seat.status": "selected", "seat.expiresAt": { $lt: now } }] }
        );
        console.log("Expired seats cleaned up.");
    } catch (error) {
        console.error("Error cleaning up expired seats:", error);
    }
};

module.exports = cleanupExpiredSeats;