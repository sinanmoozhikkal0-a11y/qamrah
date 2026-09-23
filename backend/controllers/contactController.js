import ContactPage from '../models/ContactPage.js';
import ContactMessage from '../models/ContactMessage.js';
import { sendResponse } from '../utils/sendResponse.js';

export const getContactPageData = async (_req, res) => {
  try {
    let page = await ContactPage.findOne();
    if (!page) {
      page = await ContactPage.create({});
    }
    return sendResponse(res, 200, true, 'Contact page content retrieved.', page);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

export const updateContactPageData = async (req, res) => {
  try {
    let page = await ContactPage.findOne();
    if (!page) {
      page = await ContactPage.create(req.body);
    } else {
      page = await ContactPage.findByIdAndUpdate(page._id, req.body, {
        new: true,
        runValidators: true
      });
    }
    return sendResponse(res, 200, true, 'Changes saved successfully.', page);
  } catch (err) {
    return sendResponse(res, 400, false, 'Failed to save contact content: ' + err.message);
  }
};

export const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return sendResponse(res, 400, false, 'Please provide name, email, and message.');
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      subject: subject || 'General',
      message
    });

    return sendResponse(res, 201, true, 'Thank you for contacting QAMRAH. Our concierge will get back to you shortly.', newMessage);
  } catch (err) {
    return sendResponse(res, 500, false, 'Failed to send message: ' + err.message);
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    const messages = await ContactMessage.find(query).sort({ createdAt: -1 });
    return sendResponse(res, 200, true, 'Contact messages retrieved.', messages);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

export const updateContactMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return sendResponse(res, 404, false, 'Message not found.');
    }

    return sendResponse(res, 200, true, 'Message status updated.', updated);
  } catch (err) {
    return sendResponse(res, 400, false, err.message);
  }
};

export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ContactMessage.findByIdAndDelete(id);
    if (!deleted) {
      return sendResponse(res, 404, false, 'Message not found.');
    }
    return sendResponse(res, 200, true, 'Message deleted successfully.');
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};
