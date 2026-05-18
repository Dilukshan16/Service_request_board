require('dotenv').config();
const mongoose = require('mongoose');
const JobRequest = require('./models/JobRequest');

const sampleJobs = [
  {
    title: 'Leaking kitchen tap needs urgent repair',
    description:
      'The kitchen tap has been dripping for two weeks and is getting worse. Water pressure seems low too. Looking for someone who can come out this week.',
    category: 'Plumbing',
    location: 'Glasgow',
    contactName: 'Sarah Mitchell',
    contactEmail: 'sarah.mitchell@example.com',
    status: 'Open',
  },
  {
    title: 'Full house rewire - 4 bedroom property',
    description:
      'Victorian terrace built 1890s, original wiring throughout. Need full rewire to modern standards, including consumer unit upgrade and outdoor sockets in garden.',
    category: 'Electrical',
    location: 'Edinburgh',
    contactName: 'James Hargreaves',
    contactEmail: 'j.hargreaves@example.com',
    status: 'In Progress',
  },
  {
    title: 'Living room and hallway painting',
    description:
      'Two rooms need painting - living room is large (approx 25 sqm) and hallway with stairs. Walls and ceilings. We have chosen colours already, just need a skilled painter.',
    category: 'Painting',
    location: 'Aberdeen',
    contactName: 'Fiona Campbell',
    contactEmail: 'fiona.c@example.com',
    status: 'Open',
  },
  {
    title: 'Garden decking installation',
    description:
      'Looking for a joiner to build composite decking in the back garden, approximately 4m x 5m. Need raised on one side due to slope. Supply and fit preferred.',
    category: 'Joinery',
    location: 'Dundee',
    contactName: 'Robert Tan',
    contactEmail: 'rob.tan@example.com',
    status: 'Open',
  },
  {
    title: 'Boiler making banging noises',
    description:
      'Combi boiler started banging loudly when heating comes on. About 8 years old. Unsure if it needs a service, repair, or replacement. Need someone to assess.',
    category: 'Plumbing',
    location: 'Glasgow',
    contactName: 'Angela Reid',
    contactEmail: 'angela.reid@example.com',
    status: 'Closed',
  },
  {
    title: 'Outdoor security lighting installation',
    description:
      'Want three PIR security lights fitted: front door, side gate, and back garden. Existing outdoor sockets available. Prefer a certified electrician.',
    category: 'Electrical',
    location: 'Inverness',
    contactName: 'Daniel MacLeod',
    contactEmail: 'dan.macleod@example.com',
    status: 'Open',
  },
  {
    title: 'Bathroom tiles need re-grouting',
    description:
      'Shower area tiles have mould in grout lines and some cracked grout. Approximately 8 sqm of tiles. Also one loose tile near the floor that needs re-fixing.',
    category: 'General',
    location: 'Stirling',
    contactName: 'Carol Forbes',
    contactEmail: 'carol.f@example.com',
    status: 'Open',
  },
  {
    title: 'Kitchen cabinet doors replacement',
    description:
      'Have a fitted kitchen with 18 cabinet doors that need replacing - hinges are tired and one door is cracked. Happy to keep existing carcasses, just need new doors and handles fitted.',
    category: 'Joinery',
    location: 'Perth',
    contactName: 'Michael Stewart',
    contactEmail: 'm.stewart@example.com',
    status: 'In Progress',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/globaltna');
    console.log('Connected to MongoDB');

    await JobRequest.deleteMany({});
    console.log('Cleared existing jobs');

    const inserted = await JobRequest.insertMany(sampleJobs);
    console.log(`Inserted ${inserted.length} sample jobs`);

    await mongoose.disconnect();
    console.log('Done. Disconnected from MongoDB.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
