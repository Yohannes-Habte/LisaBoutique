import Testimonial from '../models/testimonialModel.js';
import createError from 'http-errors';

export const createTestimonial = async (req, res, next) => {
  try {
    const newTestimonial = new Testimonial({
      ...req.body,
      file: `http://localhost:5000/images/${req.file.filename}`,
    });
    const testimonial = await newTestimonial.save();
    res.status(201).json({ success: true, testimonial: testimonial });
  } catch (err) {
    return next(
      createError(404, 'The image could not be saved in the database!')
    );
  }
};
