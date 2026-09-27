import jwt from "jsonwebtoken";
import { sendError } from "../commanUtils.js";

export const authmiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return sendError(res, "Header is missing", 401);
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return sendError(res, "Token is missing", 401);
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { id: decode.id, role: decode.role };

        next();
    } catch (error) {
        console.log(error);
        return sendError(res, "Authorization failed", 401);
    }
};

export const adminMiddleware = async (req, res, next) => {
    if (req.user?.role !== "admin") {
        return sendError(res, "Admin access required", 403);
    }
    next();
};