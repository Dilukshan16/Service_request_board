const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const JobRequest = require('../models/JobRequest');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/globaltna_test');
});

afterEach(async () => {
  await JobRequest.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('GET /api/jobs', () => {
  it('returns empty array when no jobs exist', async () => {
    const res = await request(app).get('/api/jobs');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.count).toBe(0);
  });

  it('returns all jobs', async () => {
    await JobRequest.create([
      { title: 'Job A', description: 'Desc A', category: 'Plumbing' },
      { title: 'Job B', description: 'Desc B', category: 'Electrical' },
    ]);
    const res = await request(app).get('/api/jobs');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(2);
  });

  it('filters by category', async () => {
    await JobRequest.create([
      { title: 'Job A', description: 'Desc A', category: 'Plumbing' },
      { title: 'Job B', description: 'Desc B', category: 'Electrical' },
    ]);
    const res = await request(app).get('/api/jobs?category=Plumbing');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].category).toBe('Plumbing');
  });

  it('filters by status', async () => {
    await JobRequest.create([
      { title: 'Job A', description: 'Desc A', status: 'Open' },
      { title: 'Job B', description: 'Desc B', status: 'Closed' },
    ]);
    const res = await request(app).get('/api/jobs?status=Open');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
  });
});

describe('POST /api/jobs', () => {
  it('creates a job with valid data', async () => {
    const payload = {
      title: 'Fix my roof',
      description: 'Several tiles missing after storm',
      category: 'General',
      location: 'Glasgow',
      contactName: 'John Smith',
      contactEmail: 'john@example.com',
    };
    const res = await request(app).post('/api/jobs').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe(payload.title);
    expect(res.body.data.status).toBe('Open');
    expect(res.body.data.createdAt).toBeDefined();
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .send({ description: 'Some description' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.missing).toContain('title');
  });

  it('returns 400 when description is missing', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .send({ title: 'Some title' });
    expect(res.status).toBe(400);
    expect(res.body.missing).toContain('description');
  });

  it('returns 400 for invalid email format', async () => {
    const res = await request(app).post('/api/jobs').send({
      title: 'Some job',
      description: 'Some description',
      contactEmail: 'not-an-email',
    });
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/jobs/:id', () => {
  it('updates status successfully', async () => {
    const job = await JobRequest.create({ title: 'Job', description: 'Desc' });
    const res = await request(app)
      .patch(`/api/jobs/${job._id}`)
      .send({ status: 'In Progress' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('In Progress');
  });

  it('returns 400 for invalid status', async () => {
    const job = await JobRequest.create({ title: 'Job', description: 'Desc' });
    const res = await request(app)
      .patch(`/api/jobs/${job._id}`)
      .send({ status: 'Unknown' });
    expect(res.status).toBe(400);
  });

  it('returns 404 for non-existent job', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .patch(`/api/jobs/${fakeId}`)
      .send({ status: 'Closed' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/jobs/:id', () => {
  it('deletes a job', async () => {
    const job = await JobRequest.create({ title: 'Job', description: 'Desc' });
    const res = await request(app).delete(`/api/jobs/${job._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deleted');
    const gone = await JobRequest.findById(job._id);
    expect(gone).toBeNull();
  });

  it('returns 404 for non-existent job', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/jobs/${fakeId}`);
    expect(res.status).toBe(404);
  });
});
