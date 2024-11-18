import express from 'express';
import {
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  listEvents,
  addReview,
  getEventReviews,
  getCountries,
  getCitiesByCountry,
  getLocationsByCity,
  searchEvents,
  getTrendingEvents,
  getRandomEvents
} from '../controllers/eventController.js';
import {updateEventDetails} from '../controllers/eventDetailsController.js';
// import { getAvailableSpeakers } from '../controllers/speakerController.js';
import verifyJWT from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();


// Route to create events:
router.post('/create', verifyJWT, upload.single('image'), createEvent);             // Restricted to organizers

// Route to list events:
router.get('/', listEvents);                          // Public route to list events with filters

// for search:
router.get('/search', searchEvents);  // Route for text-based search

// for filtering:
router.get('/countries', getCountries);                    // Get all countries
router.get('/cities/:country', getCitiesByCountry);        // Get cities for a country
router.get('/locations/:city', getLocationsByCity);        // Get locations for a city

// Route to get trending events:
router.get('/trending', getTrendingEvents);
router.get('/random', getRandomEvents)

// endPoint to update eventDetails
router.put('/:event_id/details', verifyJWT, updateEventDetails); // Endpoint to update event details



// Routes to post and get reviews for a specific event
router.post('/:id/review', verifyJWT, addReview);     // Any user can add a review
router.get('/:id/reviews', getEventReviews);          // Public route to view event reviews


// Routes to get an event, update and detlete (for organizer)
router.get('/:id', getEvent);                         // Public route to get event details
router.put('/:id', verifyJWT, updateEvent);           // Restricted to organizers
router.delete('/:id', verifyJWT, deleteEvent);        // Restricted to organizers

export default router;











// import express from 'express';
// import { createEvent, getEvent, updateEvent, deleteEvent, listEvents } from '../controllers/eventController.js';
// import verifyJWT from '../middlewares/auth.middleware.js';

// const router = express.Router();

// router.post('/', verifyJWT, createEvent);
// router.get('/', listEvents);
// router.get('/:id', getEvent);
// router.put('/:id', verifyJWT, updateEvent);
// router.delete('/:id', verifyJWT, deleteEvent);

// export default router;


