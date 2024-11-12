import Event from '../models/Event.js';
import EventDetails from '../models/EventDetails.js';
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

// controller to get the trending events:
const TRENDING_LIMIT = 4;  // Maximum number of trending events to fetch

export const getTrendingEvents = AsyncHandler(async (req, res) => {
    try {
        // Fetch up to TRENDING_LIMIT events sorted by interest count (highest first)
        let trendingEvents = await Event.getTrendingEvents(TRENDING_LIMIT);

        // If no trending events, fetch random events instead
        if (trendingEvents.length === 0) {
            trendingEvents = await Event.getRandomEvents(TRENDING_LIMIT);
        }

        res.status(200).json(new ApiResponse(200, trendingEvents, 'Trending events fetched successfully'));

    } catch (error) {
        console.error("Error fetching trending events:", error.message);
        throw new ApiError(500, error.message || 'Failed to fetch trending events');
    }
});




export const createEvent = AsyncHandler(async (req, res) => {
  try {
      const { name, description, country, city, district, town, place, address, latitude, longitude, google_maps_link, frequency, capacity, gender_allowance, time, duration, image_url, speakers, event_date, attendee_count } = req.body;

      // Check if user is an organizer
      if (!req.user.isOrganizer) {
          throw new ApiError(403, 'Only organizers can create events');
      }

      // Fetch the organizer_id from the organizers table for the authenticated user
      const organizer = await Organizer.findByUserId(req.user.id);
      if (!organizer) {
          throw new ApiError(404, 'Organizer not found for the current user');
      }

      // Duplicate event check (based on fields in the events table)
      const existingEvent = await Event.findSimilar({ name, event_date, place, city, country });
      if (existingEvent) {
          throw new ApiError(409, 'An event with these details already exists');
      }

      // Create the event in the events table
      const [newEvent] = await Event.create({
          name,
          description,
          country,
          city,
          district,
          town,
          place,
          address,
          latitude,
          longitude,
          google_maps_link,
          frequency,
          capacity,
          gender_allowance,
          time,
          duration,
          image_url,
          organizer_id: organizer.organizer_id, // Use the organizer_id from the organizers table
      });

      console.log("This is the created Event: ", newEvent)

      // Create associated event details in the eventDetails table
      const eventDetails = await EventDetails.create({
          event_id: newEvent.event_id,
          organizer_id: organizer.organizer_id, // Associate eventDetails with the organizer
          event_date: event_date,                     // Date of the event
          eventspeakers: speakers, // Array of speaker IDs
          attendee_count: attendee_count            // Number of attendees (as a numeric value)
      });

      res.status(201).json(new ApiResponse(201, { newEvent, eventDetails }, 'Event and details created successfully'));

  } catch (error) {
      throw new ApiError(500, error.message || 'Failed to create event');
  }
});


// export const createEvent = AsyncHandler(async (req, res) => {
//   if (!req.user.isOrganizer) throw new ApiError(403, 'Only organizers can create events');

//   const { name, date, place, city, country } = req.body;

//   // Check if an event with the same details exists
//   const existingEvent = await Event.findSimilar({ name, date, place, city, country });
//   if (existingEvent) {
//     throw new ApiError(409, 'Event with the following details already exists');
//   }

//   const newEvent = await Event.create(req.body);
//   res.status(201).json(new ApiResponse(201, newEvent, 'Event created'));
// });


// Get event details

export const getEvent = AsyncHandler(async (req, res) => {
  try {
      const eventId = req.params.id;

      // Fetch the event from the events table
      const event = await Event.findById(eventId);
      if (!event) {
          throw new ApiError(404, 'Event not found');
      }

      // Fetch the related eventDetails
      const eventDetails = await EventDetails.findByEventId(eventId);
      // if (!eventDetails) {
      //     throw new ApiError(404, 'Event details not found');
      // }

      // Combine event and eventDetails data
      const eventWithDetails = { ...event, details: eventDetails? eventDetails: "Event Details have not been updated yet" };

      res.status(200).json(new ApiResponse(200, eventWithDetails, 'Event retrieved successfully'));

  } catch (error) {
      console.error("Error fetching event:", error.message);
      throw new ApiError(500, error.message || 'Failed to retrieve event');
  }
});

// export const getEvent = AsyncHandler(async (req, res) => {
//   const event = await Event.findById(req.params.id);
//   if (!event) throw new ApiError(404, 'Event not found');
//   res.json(new ApiResponse(200, event, 'Event retrieved'));
// });







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

// export const listEvents = AsyncHandler(async (req, res) => {
//   const { country, city, startDate, endDate, page = 1, limit = 10 } = req.query;
//   const offset = (page - 1) * limit;

//   const events = await Event.findAll({ country, city, startDate, endDate, offset, limit });
//   res.json(new ApiResponse(200, events, 'Events retrieved'));
// });


// export const listEvents = AsyncHandler(async (req, res) => {
//   try {
//     const { country, city, location, page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * limit;

//     // Start building the query with potential filters
//     let query = Event.findAll();

//     if (country) query.where('country', country);
//     if (city) query.where('city', city);
//     if (location) query.where('place', location);

//     // Fetch events, ordering randomly if no filters are applied
//     const events = await query
//       .offset(offset)
//       .limit(limit)
//       .orderByRaw(country || city || location ? 'NULL' : 'RANDOM()');

//     res.status(200).json(new ApiResponse(200, events, 'Events retrieved'));
//   } catch (error) {
//     // Log the error (useful for debugging)
//     console.error('Error retrieving events:', error);

//     // Return a generic error response
//     throw new ApiError(500, 'Error retrieving events');
//   }
// });



export const listEvents = AsyncHandler(async (req, res) => {
  const { country, city, location, page = 1, limit = 10 } = req.query;

  // Calculate offset
  const offset = (page - 1) * limit;
  // Pass query parameters as an object to findAll
  const events = await Event.findAll({ country, city, location, offset, limit });
  
  console.log("THis is the query for fething events: ", events)

  res.json(new ApiResponse(200, 'Events retrieved', events));
});

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
