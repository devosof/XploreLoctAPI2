import EventDetails from '../models/EventDetails.js';
import { AsyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import knex from '../db/db.js';




// controllers/eventDetailsController.js

export const updateEventDetails = AsyncHandler(async (req, res) => {
    try {
        const { event_id } = req.params;
        const { speakers, date, eventAttendees } = req.body;

        // Fetch the organizer_id of the current user
        const organizer = await knex('organizers').where({ user_id: req.user.id }).first();
        if (!organizer) {
            throw new ApiError(403, "You must be an organizer to update event details");
        }

        // Check if the current organizer has authority over the event
        const eventDetails = await EventDetails.findByEventAndOrganizer(event_id, organizer.organizer_id);
        if (!eventDetails) {
            throw new ApiError(403, "You don't have permission to update this event");
        }

        // Update event details
        const updatedDetails = await EventDetails.update(event_id, organizer.organizer_id, { event_speakers: speakers, event_date: date, attendee_count: eventAttendees });
        res.status(200).json(new ApiResponse(200, updatedDetails, 'Event details updated successfully'));

    } catch (error) {
        console.error("Error updating event details:", error.message);
        throw new ApiError(500, error.message || 'Failed to update event details');
    }
});


// // controllers/eventDetailsController.js
// export const updateEventDetails = AsyncHandler(async (req, res) => {
//     const { event_id } = req.params;
//     const { speakers, date, eventAttendees } = req.body;

//     // Fetch the organizer_id of the current user
//     const organizer = await knex('organizers').where({ user_id: req.user.id }).first();
//     if (!organizer) {
//         throw new ApiError(403, "You must be an organizer to update event details");
//     }

//     // Check if the current organizer has authority over the event
//     const eventDetails = await EventDetails.findByEventAndOrganizer(event_id, organizer.organizer_id);
//     if (!eventDetails) {
//         throw new ApiError(403, "You don't have permission to update this event");
//     }

//     // Update event details
//     const updatedDetails = await EventDetails.update(event_id, organizer.organizer_id, { speakers, date, eventAttendees });
//     res.status(200).json(new ApiResponse(200, updatedDetails, 'Event details updated successfully'));
// });
