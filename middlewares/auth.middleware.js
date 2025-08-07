import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function protectRoute(req, res, next) {
    try {
        const authCookie = req.cookies.AuthCookie;
        if(!authCookie) {
            return res.status(404).json({
                status: 404,
                message: "Cookie not found"
            });
        }
        const key = process.env.SECRET_KEY;
        const user = jwt.verify(authCookie, key);
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({
            status: 500,
            mesage: "Server error, could not authorize"
        });
    }
}