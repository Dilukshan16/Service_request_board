const express = require('express');
const router = express.Router();
const JobRequest = require('../models/JobRequest');

// GET /api/jobs - list all jobs with optional filters
router.get('/', async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    let query;

    // Bonus: keyword search across title and description
    if (search && search.trim()) {
      query = JobRequest.find(
        { ...filter, $text: { $search: search.trim() } },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } });
    } else {
      query = JobRequest.find(filter).sort({ createdAt: -1 });
    }

    const jobs = await query;
    res.json({ count: jobs.length, data: jobs });
  } catch (err) {
    next(err);
  }
});

// GET /api/jobs/:id - fetch a single job
router.get('/:id', async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ data: job });
  } catch (err) {
    next(err);
  }
});

// POST /api/jobs - create a new job
router.post('/', async (req, res, next) => {
  try {
    const { title, description, category, location, contactName, contactEmail } = req.body;

    // Validate required fields
    const missing = [];
    if (!title || !title.trim()) missing.push('title');
    if (!description || !description.trim()) missing.push('description');

    if (missing.length) {
      return res.status(400).json({
        error: 'Validation failed',
        missing,
      });
    }

    const job = await JobRequest.create({
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
    });

    res.status(201).json({ data: job });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: Object.values(err.errors).map((e) => e.message),
      });
    }
    next(err);
  }
});

// PATCH /api/jobs/:id - update status only
router.patch('/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Open', 'In Progress', 'Closed'];

    if (!status) {
      return res.status(400).json({ error: 'status field is required' });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ data: job });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/jobs/:id - delete a job
router.delete('/:id', async (req, res, next) => {
  try {
    const job = await JobRequest.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully', data: job });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
