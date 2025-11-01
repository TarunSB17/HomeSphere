import Inquiry from '../models/Inquiry.js';

// @desc    Create new inquiry
// @route   POST /api/inquiry
// @access  Public
export const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, message, propertyId } = req.body;

    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      message,
      property: propertyId
    });

    const populatedInquiry = await Inquiry.findById(inquiry._id).populate('property', 'title price');

    res.status(201).json({
      message: 'Inquiry submitted successfully',
      inquiry: populatedInquiry
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all inquiries for a property
// @route   GET /api/inquiry/property/:propertyId
// @access  Private
export const getPropertyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ property: req.params.propertyId })
      .populate('property', 'title')
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all inquiries
// @route   GET /api/inquiry
// @access  Private
export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate('property', 'title price owner')
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiry/:id
// @access  Private
export const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('property', 'title');

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
