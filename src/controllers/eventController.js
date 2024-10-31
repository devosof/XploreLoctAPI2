import Event from '../models/Event.js';
import {AsyncHandler} from '../utils/AsyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';

export const createEvent = AsyncHandler(async (req, res) => {
  const newEvent = await Event.create(req.body);
  res.status(201).json(new ApiResponse(201, newEvent, 'Event created'));
});

export const getEvent = AsyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw new ApiError(404, 'Event not found');
  res.json(new ApiResponse(200, event, 'Event retrieved'));
});

export const updateEvent = AsyncHandler(async (req, res) => {
  const updatedEvent = await Event.update(req.params.id, req.body);
  if (!updatedEvent) throw new ApiError(404, 'Event not found');
  res.json(new ApiResponse(200, updatedEvent, 'Event updated'));
});

export const deleteEvent = AsyncHandler(async (req, res) => {
  await Event.delete(req.params.id);
  res.json(new ApiResponse(200, 'Event deleted'));
});

export const listEvents = AsyncHandler(async (req, res) => {
  const events = await Event.findAll();
  res.json(new ApiResponse(200, events, 'Events retrieved'));
});
