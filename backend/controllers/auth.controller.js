import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import config from 'config'
import _ from 'lodash'
import debug from 'debug';
const log = debug('mychat');
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Generate profile picture URL based on gender
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    // Pick the necessary fields from the request body
    const newUserFields = _.pick(req.body, ['fullName', 'username', 'password', 'gender']);
    newUserFields.profilePic = gender === "male" ? boyProfilePic : girlProfilePic;

    // Create the new user object
    const newUser = new User(newUserFields);
    console.log(newUser.password)

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await newUser.save();

    // Generate JWT token
    generateTokenAndSetCookie(newUser._id, res);

    // Send the response with the necessary user details
    res.status(201).json(_.pick(newUser, ['_id', 'fullName', 'username', 'profilePic']));
  } catch (error) {
    console.error("Error in signup controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
		});
	} catch (error) {
		log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

