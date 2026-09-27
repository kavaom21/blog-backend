import express from "express";
import { authmiddleware, adminMiddleware } from "../middleware/authentication.js";
import { createBlog, updateBlog, deleteBlog, getAllBlogs, getBlogById } from "./blog.controller.js";
import { likeBlog, commentOnBlog, shareBlog } from "./blog.controller.js";


const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

router.post("/:id/like", authmiddleware, likeBlog);
router.post("/:id/comment", authmiddleware, commentOnBlog);
router.post("/:id/share", authmiddleware, shareBlog);
router.post("/", authmiddleware, adminMiddleware, createBlog);
router.put("/:id", authmiddleware, adminMiddleware, updateBlog);
router.delete("/:id", authmiddleware, adminMiddleware, deleteBlog);

export default router;