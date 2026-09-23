import StoryPage from '../models/StoryPage.js';
import { sendResponse } from '../utils/sendResponse.js';

export const getStoryPageData = async (_req, res) => {
  try {
    let story = await StoryPage.findOne();
    if (!story) {
      story = await StoryPage.create({});
    }
    return sendResponse(res, 200, true, 'Our story content retrieved.', story);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

export const updateStoryPageData = async (req, res) => {
  try {
    let story = await StoryPage.findOne();
    if (!story) {
      story = await StoryPage.create(req.body);
    } else {
      story = await StoryPage.findByIdAndUpdate(story._id, req.body, {
        new: true,
        runValidators: true
      });
    }
    return sendResponse(res, 200, true, 'Changes saved successfully.', story);
  } catch (err) {
    return sendResponse(res, 400, false, 'Failed to save story content: ' + err.message);
  }
};
