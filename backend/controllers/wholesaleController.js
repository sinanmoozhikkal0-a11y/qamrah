import WholesalePage from '../models/WholesalePage.js';
import WholesaleEnquiry from '../models/WholesaleEnquiry.js';
import { sendResponse } from '../utils/sendResponse.js';

export const getWholesalePageData = async (_req, res) => {
  try {
    let page = await WholesalePage.findOne();
    if (!page) {
      page = await WholesalePage.create({});
    }
    return sendResponse(res, 200, true, 'Wholesale page content retrieved.', page);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

export const updateWholesalePageData = async (req, res) => {
  try {
    let page = await WholesalePage.findOne();
    if (!page) {
      page = await WholesalePage.create(req.body);
    } else {
      page = await WholesalePage.findByIdAndUpdate(page._id, req.body, {
        new: true,
        runValidators: true
      });
    }
    return sendResponse(res, 200, true, 'Changes saved successfully.', page);
  } catch (err) {
    return sendResponse(res, 400, false, 'Failed to save wholesale content: ' + err.message);
  }
};

export const createWholesaleEnquiry = async (req, res) => {
  try {
    const { businessName, contactPerson, email, phone, businessType, productInterest, orderVolume, message } = req.body;

    if (!businessName || !contactPerson || !email || !phone) {
      return sendResponse(res, 400, false, 'Please provide business name, contact person, email, and phone.');
    }

    const enquiry = await WholesaleEnquiry.create({
      businessName,
      contactPerson,
      email,
      phone,
      businessType,
      productInterest,
      orderVolume,
      message
    });

    return sendResponse(res, 201, true, 'Your wholesale enquiry has been submitted. Our concierge will contact you within 24 hours.', enquiry);
  } catch (err) {
    return sendResponse(res, 500, false, 'Failed to submit enquiry: ' + err.message);
  }
};

export const getWholesaleEnquiries = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    const enquiries = await WholesaleEnquiry.find(query).sort({ createdAt: -1 });
    return sendResponse(res, 200, true, 'Wholesale enquiries retrieved.', enquiries);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

export const updateWholesaleEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const updated = await WholesaleEnquiry.findByIdAndUpdate(
      id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return sendResponse(res, 404, false, 'Enquiry not found.');
    }

    return sendResponse(res, 200, true, 'Enquiry updated successfully.', updated);
  } catch (err) {
    return sendResponse(res, 400, false, err.message);
  }
};

export const deleteWholesaleEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await WholesaleEnquiry.findByIdAndDelete(id);
    if (!deleted) {
      return sendResponse(res, 404, false, 'Enquiry not found.');
    }
    return sendResponse(res, 200, true, 'Enquiry deleted successfully.');
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};
