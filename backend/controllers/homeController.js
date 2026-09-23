import HomePage from '../models/HomePage.js';
import { sendResponse } from '../utils/sendResponse.js';

export const getHomePageData = async (_req, res) => {
  try {
    let home = await HomePage.findOne();
    if (!home) {
      home = await HomePage.create({});
    }
    return sendResponse(res, 200, true, 'Home page data retrieved.', home);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

export const updateHomePageData = async (req, res) => {
  try {
    let home = await HomePage.findOne();
    if (!home) {
      home = await HomePage.create(req.body);
    } else {
      home = await HomePage.findByIdAndUpdate(home._id, req.body, {
        new: true,
        runValidators: true
      });
    }
    return sendResponse(res, 200, true, 'Changes saved successfully.', home);
  } catch (err) {
    return sendResponse(res, 400, false, 'Failed to save changes: ' + err.message);
  }
};
