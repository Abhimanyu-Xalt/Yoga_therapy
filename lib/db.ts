/// <reference types="node" />
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://abhimanyuxalt:Abhi4321@cluster0.iz2p7hj.mongodb.net/';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface GlobalWithMongoose {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

declare const global: GlobalWithMongoose;

const options: mongoose.ConnectOptions = {
  bufferCommands: true,
  autoCreate: true,
  autoIndex: true,
};

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached?.conn) {
    console.log('Using cached database connection');
    return cached.conn;
  }

  if (!cached?.promise) {
    console.log('Creating new database connection');
    cached!.promise = mongoose
      .connect(MONGODB_URI, options)
      .then((mongoose) => {
        console.log('Database connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('Error connecting to database:', error);
        throw error;
      });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

// Handle connection errors
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

// Handle disconnection
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

// Handle successful reconnection
mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully');
});

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

export default connectDB; 