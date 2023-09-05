import mongoose from 'mongoose';

const mongoURI = "mongodb+srv://chinuvakare:7BNxqnaLLqwJzWWa@cluster0.muojsz7.mongodb.net/BLOGS?retryWrites=true&w=majority";

export async function connection() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}
