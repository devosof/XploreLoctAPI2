// controllers/speakerController.js
import Speaker from '../models/Speakers.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { AsyncHandler } from '../utils/AsyncHandler.js';

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
