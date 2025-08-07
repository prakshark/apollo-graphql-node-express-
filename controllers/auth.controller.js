import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import graphQLAuthUser from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

export async function registerUser(req, res) {
    const {username, name, email, password, repeatPassword} = req.body;
    let user = await graphQLAuthUser.findOne({username: username});
    if(user) {
        return res.status(400).json({
            status: 400,
            message: "Username already exists"
        });
    }

    user = await graphQLAuthUser.findOne({email: email});
    if(user) {
        return res.status(400).json({
            status: 400,
            message: "Email already exists"
        });
    }

    if(password !== repeatPassword) {
        return res.status(400).json({
            status: 400,
            message: "Passwords do not match"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await new graphQLAuthUser({
        username: username,
        name: name,
        email: email,
        password: hashedPassword
    })
    await newUser.save();
    const key = process.env.SECRET_KEY;
    const token = jwt.sign({
        username: username,
        email: email,
        name: name
    }, key, {expiresIn: "5h"});

    res.cookie("AuthCookie", token);

    return res.status(201).json({
        status: 201,
        message: "User registered and token created in browser cookie",
        user: newUser
    });
}

export async function loginUser(req, res) {
    const {username, password} = req.body;
    const user = await graphQLAuthUser.findOne({username: username});
    if(!user) {
        return res.status(404).json({
            status: 404,
            message: "User does not exists"
        });
    }

    const correctHashedPassword = user.password;
    const isCorrectpassword = await bcrypt.compare(password, correctHashedPassword);
    if(!isCorrectpassword) {
        return res.status(400).json({
            status: 400,
            message: "Password is incorrect"
        });
    }

    let token = req.cookies.AuthCookie;
    if(token) {
        return res.status(400).json({
            status: 400,
            message: "User already logged in. Logout first"
        });
    }

    const email = user.email;
    const name = user.name;
    const key = process.env.SECRET_KEY;
    token = jwt.sign({
        username: username,
        email: email,
        name: name
    }, key, {expiresIn: "5h"});

    res.cookie("AuthCookie", token);

    res.status(200).json({
        status: 200,
        message: "User logged in and token created"
    });
}

export async function logoutUser(req, res) {
    res.clearCookie("AuthCookie");
    res.status(200).json({
        status: 200,
        message: "User logged out and cookie deleted"
    });
}

export async function getUserProfile(req, res) {
    const user = req.user;
    if(!user) {
        return res.status(400).json({
            status: 400,
            message: "Failed to authenticate user"
        });
    }

    return res.status(200).json({
        status: 200,
        userProfile: user
    });
}
