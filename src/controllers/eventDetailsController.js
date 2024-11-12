import EventDetails from '../models/EventDetails.js';
import { AsyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import knex from '../db/db.js';




// controllers/eventDetailsController.js

export const updateEventDetails = AsyncHandler(async (req, res) => {
    try {
        const { event_id } = req.params;
        let { speakers, event_date, attendee_count } = req.body;

        if (speakers) {
            speakers = speakers.split(',').map(id => parseInt(id, 10)); // Convert to array of integers
        }

        // Ensure date format is correct
    
        const formattedDate = new Date(event_date);
        if (isNaN(formattedDate)) {
            throw new ApiError(400, 'Invalid event date format');
        }

        // Convert the date to YYYY-MM-DD format
        const eventDateString = formattedDate.toISOString().split('T')[0];  // Format: YYYY-MM-DD
        console.log("Formatted Event Date:", eventDateString);

        // // Ensure attendee_count is a valid integer
        // const attendeeCountInt = parseInt(attendee_count, 10);
        // if (isNaN(attendeeCountInt)) {
        //     throw new ApiError(400, 'Invalid attendee count');
        // }


        // Fetch the organizer_id of the current user
        const organizer = await knex('organizers').where({ user_id: req.user.id }).first();
        console.log("This is the current organizer: ", organizer)
        if (!organizer) {
            throw new ApiError(403, "You must be an organizer to update event details");
        }

        // Check if the current organizer has authority over the event
        const eventDetails = await EventDetails.findByEventAndOrganizer(event_id, organizer.organizer_id);
        console.log("These are the event details for the current organizer: ", eventDetails)
        if (!eventDetails) {
            throw new ApiError(403, "You don't have permission to update this event");
        }

        // Update event details
        const updatedDetails = await EventDetails.update(event_id, organizer.organizer_id, { eventspeakers: speakers, event_date: formattedDate, attendee_count: attendee_count });
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
