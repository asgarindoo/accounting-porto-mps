import * as profileService from '../services/profile.service.js';
import { sendSuccess } from '../utils/response.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getProfile = catchAsync(async (req, res) => {
  const profile = await profileService.getProfile();
  sendSuccess(res, profile || {}, 'Profile retrieved successfully');
});

export const updateProfile = catchAsync(async (req, res) => {
  const updatedProfile = await profileService.updateProfile(req.body);
  sendSuccess(res, updatedProfile, 'Profile updated successfully');
});
