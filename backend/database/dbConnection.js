import mongoose from 'mongoose';

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: 'PORTFOLIO',
    });
    console.log('Connected to Database');
  } catch (error) {
    console.error(`Error connecting to the database: ${error.message}`);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export default dbConnection;
