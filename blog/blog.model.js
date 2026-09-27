import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mediaUrl: {
        type: String,
        required: false
    },
    mediaType: {
        type: String,
        enum: ["image", "gif", "video", "url", "none"],
        default: "none"
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [commentSchema],
    shareCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model("Blog", blogSchema);