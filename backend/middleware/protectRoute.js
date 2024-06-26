import jwt from "jsonwebtoken";
import debug from 'debug';
import config from 'config'
const log = debug('mychat');
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, config.get('PRIVATEKEY'));

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized Access- Invalid Token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        log("Error in protectRoute middleware: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default protectRoute;
