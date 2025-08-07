import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
    const uri = process.env.MONGODB_URI;
    try {
        await mongoose.connect(uri);
        console.log(`Conected to MongoDB`);
        return;
    } catch (error) {
        console.log(`Error connecting to MongoDB`);
        return;
    }
}