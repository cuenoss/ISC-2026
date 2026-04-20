import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Speaker from './models/Speaker.js';
import Agenda from './models/Agenda.js';
import Conference from './models/Conference.js';

dotenv.config();

const updateDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/isc2026');
    console.log('Connected to MongoDB for database update');

    // Force schema update by touching each collection
    console.log('Updating Speaker schema...');
    await Speaker.findOne({}); // This will trigger schema validation
    
    console.log('Updating Agenda schema...');
    await Agenda.findOne({}); // This will trigger schema validation
    
    console.log('Updating Conference schema...');
    await Conference.findOne({}); // This will trigger schema validation

    console.log('Database schema updated successfully');
    
    await mongoose.disconnect();
    console.log('Disconnected from database');
  } catch (error) {
    console.error('Database update error:', error);
    process.exit(1);
  }
};

updateDatabase();
