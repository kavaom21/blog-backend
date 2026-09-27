import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Userrouter from "./user/user.routes.js";
import Blogrouter from "./blog/blog.routes.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8000;

app.use(express.json());

let isConnected = false;

const mongoconnect = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 20000,
            socketTimeoutMS: 45000,
        });
        isConnected = true;
        console.log("mongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection error:", error);
    }
};

app.use(async (req, res, next) => {
    await mongoconnect();
    next();
});

app.use("/api/users", Userrouter);
app.use("/api/blogs", Blogrouter);

if (process.env.VERCEL !== "1") {
    app.listen(PORT, () => {
        console.log(`server started on port ${PORT}`);
    });
}

export default app;