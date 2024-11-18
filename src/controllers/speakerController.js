// controllers/speakerController.js
import Speaker from '../models/Speakers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { AsyncHandler } from '../utils/AsyncHandler.js';
import knex from '../db/db.js';

export const registerSpeaker = AsyncHandler(async (req, res) => {
  try {
    const { bio } = req.body;
    const user_id = req.user.id;

    // Check if user is already registered as a speaker
    const existingSpeaker = await Speaker.findByUserId(user_id);
    if (existingSpeaker) {
      throw new ApiError(409, 'User is already registered as a speaker');
    }

    const newSpeaker = await Speaker.create({ user_id, bio });
    res.status(201).json(new ApiResponse(201, newSpeaker, 'Speaker registered successfully'));
  } catch (error) {
    res.status(error.statusCode || 500).json({ status: 'error', message: error.message });
  }
});

export const updateSpeakerDetails = AsyncHandler(async (req, res) => {
  try {
    const user_id = req.user.id;
    const { bio } = req.body;

    // Check if user is registered as a speaker
    const existingSpeaker = await Speaker.findByUserId(user_id);
    if (!existingSpeaker) {
      throw new ApiError(404, 'Speaker profile not found');
    }

    const updatedSpeaker = await Speaker.update(user_id, { bio });
    res.status(200).json(new ApiResponse(200, updatedSpeaker, 'Speaker details updated successfully'));
  } catch (error) {
    res.status(error.statusCode || 500).json({ status: 'error', message: error.message });
  }
});



// controllers/speakerController.js

// export const getAvailableSpeakers = AsyncHandler(async (req, res) => {
//   const speakers = await Speaker.findAll();
//   res.status(200).json(new ApiResponse(200, speakers, 'Available speakers retrieved successfully'));
// });


export const getAvailableSpeakers = AsyncHandler(async (req, res) => {
  try {
    // Fetch all available speakers with user details
    const speakers = await knex('speakers')
      .join('users', 'speakers.user_id', '=', 'users.id')
      .select(
        'speakers.speaker_id',
        'speakers.bio',
        'speakers.user_id',
        'users.username as name',
        'users.phone',
        'users.email',
        'users.avatar',
      );

    // Check if speakers are found
    if (!speakers || speakers.length === 0) {
      return res.status(200).json(new ApiResponse(200, [], 'No speakers available'));
    }

    // Return the speakers with success message
    res.status(200).json(new ApiResponse(200, speakers, 'Available speakers retrieved successfully'));
  } catch (error) {
    console.error("Error fetching available speakers:", error.message);
    res.status(500).json(new ApiResponse(500, null, 'An unexpected error occurred while retrieving speakers'));
  }
});

