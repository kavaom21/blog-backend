import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Userrouter from "./user/user.routes.js";
import Blogrouter from "./blog/blog.routes.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8000


app.use(express.json());

const mongoconnect = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("mongoDB connected successfully");

    } catch (error) {
        console.log(error);
    }
}

mongoconnect();

app.use("/api/users", Userrouter);
app.use("/api/blogs", Blogrouter);


app.listen(PORT, (req, res) => {
    console.log(`server started on port ${PORT}`)
});

