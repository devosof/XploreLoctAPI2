import Event from '../models/Event.js';
import Organizer from '../models/Organizers.js';
import { AsyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import knex from '../db/db.js';

// // Create event (restricted to organizers)
// export const createEvent = AsyncHandler(async (req, res) => {
//   if (!req.user.isOrganizer) throw new ApiError(403, 'Only organizers can create events');
//   const newEvent = await Event.create(req.body);
//   res.status(201).json(new ApiResponse(201, newEvent, 'Event created'));
// });

export const createEvent = AsyncHandler(async (req, res) => {
  if (!req.user.isOrganizer) throw new ApiError(403, 'Only organizers can create events');

  const { name, date, place, city, country } = req.body;

  // Check if an event with the same details exists
  const existingEvent = await Event.findSimilar({ name, date, place, city, country });
  if (existingEvent) {
    throw new ApiError(409, 'Event with the following details already exists');
  }

  const newEvent = await Event.create(req.body);
  res.status(201).json(new ApiResponse(201, newEvent, 'Event created'));
});


// Get event details
export const getEvent = AsyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw new ApiError(404, 'Event not found');
  res.json(new ApiResponse(200, event, 'Event retrieved'));
});




// Update event (restricted to the organizer who created it)
// Update event (restricted to the organizer who created it)
export const updateEvent = AsyncHandler(async (req, res) => {
  try {
    if (!req.user.isOrganizer) throw new ApiError(403, 'Only organizers can update events');

    // Find the organizer associated with the current user
    const currentOrganizer = await Organizer.findByUserId(req.user.id);
    if (!currentOrganizer) throw new ApiError(404, 'Organizer not found');

    // Find the event to ensure it exists and get the organizer_id
    const event = await Event.findById(req.params.id);
    if (!event) throw new ApiError(404, 'Event not found');

    // Check if the current organizer is the one who created the event
    if (event.organizer_id !== currentOrganizer.organizer_id) {
      throw new ApiError(403, 'You do not have permission to update this event');
    }

    // Proceed to update the event
    const updatedEvent = await Event.update(req.params.id, req.body);
    res.json(new ApiResponse(200, updatedEvent, 'Event updated'));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
    }
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, 'An unexpected error occurred'));
  }
});

// Delete event (restricted to the organizer who created it)
export const deleteEvent = AsyncHandler(async (req, res) => {
  try {
    if (!req.user.isOrganizer) throw new ApiError(403, 'Only organizers can delete events');

    // Find the organizer associated with the current user
    const currentOrganizer = await Organizer.findByUserId(req.user.id);
    if (!currentOrganizer) throw new ApiError(404, 'Organizer not found');

    // Find the event to ensure it exists and get the organizer_id
    const event = await Event.findById(req.params.id);
    if (!event) throw new ApiError(404, 'Event not found');

    // Check if the current organizer is the one who created the event
    if (event.organizer_id !== currentOrganizer.organizer_id) {
      throw new ApiError(403, 'You do not have permission to delete this event');
    }

    // Proceed to delete the event
    await Event.delete(req.params.id);
    res.json(new ApiResponse(200, 'Event deleted'));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
    }
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, 'An unexpected error occurred'));
  }
});


// // Update event (restricted to organizers)
// export const updateEvent = AsyncHandler(async (req, res) => {
//   if (!req.user.isOrganizer) throw new ApiError(403, 'Only organizers can update events');
//   const updatedEvent = await Event.update(req.params.id, req.body);
//   if (!updatedEvent) throw new ApiError(404, 'Event not found');
//   res.json(new ApiResponse(200, updatedEvent, 'Event updated'));
// });

// // Delete event (restricted to organizers)
// export const deleteEvent = AsyncHandler(async (req, res) => {
//   if (!req.user.isOrganizer) throw new ApiError(403, 'Only organizers can delete events');
//   await Event.delete(req.params.id);
//   res.json(new ApiResponse(200, 'Event deleted'));
// });

// List events with search filters
// export const listEvents = AsyncHandler(async (req, res) => {
//   const filters = req.query;
//   const events = await Event.search(filters);
//   res.json(new ApiResponse(200, events, 'Events retrieved'));
// });

export const listEvents = AsyncHandler(async (req, res) => {
  const { country, city, startDate, endDate, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const events = await Event.findAll({ country, city, startDate, endDate, offset, limit });
  res.json(new ApiResponse(200, events, 'Events retrieved'));
});



// export const listEvents = AsyncHandler(async (req, res) => {
//   const { country, city, startDate, endDate, page = 1, limit = 10 } = req.query;

//   const query = Event.findAll();
//   if (country) query.where('country', country);
//   if (city) query.where('city', city);
//   if (startDate && endDate) query.whereBetween('date', [startDate , endDate]);

//   const events = await query.offset((page - 1) * limit).limit(limit);
//   res.json(new ApiResponse(200, 'Events retrieved', events));
// });

export const searchEvents = AsyncHandler(async (req, res) => {
  const { query } = req.query;  // `query` holds the search term from the request
  if (!query) throw new ApiError(400, 'Search query is required');

  const events = await knex('events')
    .whereILike('name', `%${query}%`)
    .orWhereILike('description', `%${query}%`)
    .orWhereILike('country', `%${query}%`)
    .orWhereILike('city', `%${query}%`)
    .orWhereILike('place', `%${query}%`)
    .select('*');

  res.json(new ApiResponse(200, events, 'Search results'));
});


// export const searchEvents = AsyncHandler(async (req, res) => {
//   const { query } = req.query;
//   const events = await knex('events')
//     .whereRaw("to_tsvector('english', name || ' ' || description) @@ plainto_tsquery(?)", [query]);
//   res.json(new ApiResponse(200, 'Events search results', events));
// });


// Add review to event
export const addReview = AsyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const newReview = await Event.addReview(req.params.id, req.user.id, { rating, comment });
  res.status(201).json(new ApiResponse(201, newReview, 'Review added'));
});

// Get reviews for an event
export const getEventReviews = AsyncHandler(async (req, res) => {
  const reviews = await Event.getReviews(req.params.id);
  res.json(new ApiResponse(200, reviews, 'Reviews retrieved'));
});


// get countries
export const getCountries = AsyncHandler(async (req, res) => {
  const countries = await knex('events').distinct('country').select();
  res.json(new ApiResponse(200, countries, 'Countries retrieved'));
});



// get cities by country
export const getCitiesByCountry = AsyncHandler(async (req, res) => {
  const { country } = req.params;
  const cities = await knex('events').distinct('city').where({ country }).select();
  res.json(new ApiResponse(200, cities, 'Cities retrieved for country'));
});


// get town by cities:
export const getLocationsByCity = AsyncHandler(async (req, res) => {
  const { city } = req.params;
  const locations = await knex('events').distinct('place').where({ city }).select();
  res.json(new ApiResponse(200, locations, 'Locations retrieved for city'));
});











// import Event from '../models/Event.js';
// import {AsyncHandler} from '../utils/AsyncHandler.js';
// import {ApiResponse} from '../utils/ApiResponse.js';
// import {ApiError} from '../utils/ApiError.js';

// export const createEvent = AsyncHandler(async (req, res) => {
//   const newEvent = await Event.create(req.body);
//   res.status(201).json(new ApiResponse(201, newEvent, 'Event created'));
// });

// export const getEvent = AsyncHandler(async (req, res) => {
//   const event = await Event.findById(req.params.id);
//   if (!event) throw new ApiError(404, 'Event not found');
//   res.json(new ApiResponse(200, event, 'Event retrieved'));
// });

// export const updateEvent = AsyncHandler(async (req, res) => {
//   const updatedEvent = await Event.update(req.params.id, req.body);
//   if (!updatedEvent) throw new ApiError(404, 'Event not found');
//   res.json(new ApiResponse(200, updatedEvent, 'Event updated'));
// });

// export const deleteEvent = AsyncHandler(async (req, res) => {
//   await Event.delete(req.params.id);
//   res.json(new ApiResponse(200, 'Event deleted'));
// });

// export const listEvents = AsyncHandler(async (req, res) => {
//   const events = await Event.findAll();
//   res.json(new ApiResponse(200, events, 'Events retrieved'));
// });
