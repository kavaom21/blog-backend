import Blog from "./blog.model.js";
import { sendError, sendSuccess } from "../commanUtils.js";

export const createBlog = async (req, res) => {
    try {
        const { title, description, mediaUrl, mediaType } = req.body;

        if (!title || !description) {
            return sendError(res, "Title and description are required", 400);
        }

        const blog = await Blog.create({
            title,
            description,
            mediaUrl,
            mediaType,
            author: req.user.id
        });

        return sendSuccess(res, "Blog created successfully", blog, 201);

    } catch (error) {
        return sendError(res, "INTERNAL ERROR", 500);
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });

        if (!blog) {
            return sendError(res, "Blog not found", 404);
        }

        return sendSuccess(res, "Blog updated successfully", blog, 200);

    } catch (error) {
        return sendError(res, "INTERNAL ERROR", 500);
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return sendError(res, "Blog not found", 404);
        }

        return sendSuccess(res, "Blog deleted successfully", {}, 200);

    } catch (error) {
        return sendError(res, "INTERNAL ERROR", 500);
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        return sendSuccess(res, "Blogs fetched successfully", blogs, 200);

    } catch (error) {
        return sendError(res, "INTERNAL ERROR", 500);
    }
};

export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id)
            .populate("author", "name email")
            .populate("comments.user", "name");
            
        if (!blog) {
            return sendError(res, "Blog not found", 404);
        }

        return sendSuccess(res, "Blog fetched successfully", blog, 200);

    } catch (error) {
        return sendError(res, "INTERNAL ERROR", 500);
    }
};

export const likeBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const blog = await Blog.findById(id);
        if (!blog) return sendError(res, "Blog not found", 404);

        const alreadyLiked = blog.likes.some(u => u.toString() === userId);

        if (alreadyLiked) {
            blog.likes = blog.likes.filter(u => u.toString() !== userId);
        } else {
            blog.likes.push(userId);
        }

        await blog.save();

        return sendSuccess(
            res,
            alreadyLiked ? "Blog unliked" : "Blog liked",
            { likesCount: blog.likes.length },
            200
        );

    } catch (error) {
        return sendError(res, "INTERNAL ERROR", 500);
    }
};

export const commentOnBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        if (!text) return sendError(res, "Comment text is required", 400);

        const blog = await Blog.findById(id);
        if (!blog) return sendError(res, "Blog not found", 404);

        blog.comments.push({ user: req.user.id, text });
        await blog.save();

        const updatedBlog = await Blog.findById(id).populate("comments.user", "name");

        return sendSuccess(res, "Comment added successfully", updatedBlog.comments, 201);

    } catch (error) {
        return sendError(res, "INTERNAL ERROR", 500);
    }
};

export const shareBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findByIdAndUpdate(
            id,
            { $inc: { shareCount: 1 } },
            { new: true }
        );

        if (!blog) return sendError(res, "Blog not found", 404);

        return sendSuccess(res, "Share recorded", { shareCount: blog.shareCount }, 200);

    } catch (error) {
        return sendError(res, "INTERNAL ERROR", 500);
    }
};