const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        // expireIn: "1d"
    })
}

// Register User
const registerUser = asyncHandler(async (req, res) => {
   const{name, email, password} = req.body;

   //Validation
   if(!name || !email || !password) {
    res.status(400)
    throw new Error("Please fill in all required fields")
   }
   if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be up to 6 characters");
}
// Check if user email already exists
const userExists = await User.findOne({ email });

if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered");
}
// Create new user
const user = await User.create({
    name,
    email,
    password,
});

//   Generate Token
const token = generateToken(user._id);

// Send HTTP-only cookie
res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    // sameSite: "none",
    // secure: true,
});

//Send Response To User for signup
        if (user) {
            const { _id, name, email, photo, phone, bio } = user;
            res.status(201).json({
                _id,
                name,
                email,
                photo,
                phone,
                bio,
                token
            });

        } else {
            res.status(400);
            throw new Error("Invalid user data");
        }
    }
);

const loginUser = asyncHandler(
    async (req, res) => {
        const { email, password } = req.body;

        // Validate Request
        if (!email || !password) {
            res.status(400);
            throw new Error("Please add email and password");
        }


        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400);
            throw new Error("User not found, please signup");
        }

        // User exists, check if password is correct
        const passwordIsCorrect = await bcrypt.compare(password, user.password);

        //Generate Token
        const token = generateToken(user._id);

        if (user && passwordIsCorrect) {
            const newUser = await User.findOne({email}).select("-password")
            // Send HTTP-only cookie
            res.cookie("token", token, {
                path: "/",
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 86400), // 1 day
                // sameSite: "none",
                // secure: true,
            });
        }


        //Send Response To User for login
        if (user && passwordIsCorrect) {
            const { _id, name, email, photo, phone, bio } = user;
            res.status(200).json({
                _id,
                name,
                email,
                photo,
                phone,
                token,
            });
        } else {
            res.status(400);
            throw new Error("Invalid email or password");
        }
    }
);

const logout = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        // sameSite: "none",
        // secure: true,
    });
    return res.status(200).json({ message: "Successfully Logged Out" });
});

const getUser = asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.user._id);

        if (user.length <= 0) {
            res.status(404);
            throw new Error("User not found, please signup");
        }

        if (user) {
            const { _id, name, email, photo, address, phone, bio } = user;
            res.status(200).json({
                _id,
                name,
                email,
                photo,
                address,
                phone,
            });
        } else {
            res.status(400);
            throw new Error("User Not Found");
        }
    }

);

const updateUser = asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.user._id);
        console.log(user)
        if (user) {
            const { name, email, phone, address } = user;

            user.email = email;//Not Changed
            user.name = req.body.name || name;
            user.phone = req.body.phone || phone;
            user.address = req.body.address || address;
            

            const updatedUser = await user.save();

            res.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                
            });
        } else {
            res.status(404);
            throw new Error("User not found");
        }
    }
);

const updatePhoto = asyncHandler(
    async (req, res) => {
        const {photo} =req.body;
        const user = await User.findById(req.user._id);
        user.photo = photo
        const updatedUser = await user.save();
        return res.status(200).json(updatedUser);
    })

const getLoginStatus = asyncHandler(
    async (req, res) => {
        const token = req.cookies.token;
        if(!token) {
           return res.json(false)
        }
        //verify Token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified) {
            return res.json(true)
        }else{
        return res.json(false)
    }
})



const changePassword = asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.user._id);
        const { oldPassword, password } = req.body;


        if (!user) {
            res.status(404);
            throw new Error("User not found, please signup");
        }

        //Validate
        if (!oldPassword || !password) {
            res.status(400);
            throw new Error("Please add old and new password");
        }
        // check if old password matches password in DB
        const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

        // Save new password
        if (user && passwordIsCorrect) {
            user.password = password;
            await user.save();
            res.status(200).send("Password change successful");
        } else {
            res.status(400);
            throw new Error("Old password is incorrect");
        }
    }
);

module.exports = {
    registerUser, loginUser, logout, getUser, updateUser, getLoginStatus, changePassword, updatePhoto
}