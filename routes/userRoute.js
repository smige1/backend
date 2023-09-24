const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    logout,
    getUser,
    updateUser,
    getLoginStatus,
    changePassword,
    updatePhoto,
} = require("../controllers/userController");

const {Auth} = require("../middleware/authHandler")


//Router PATH
//!SignUp & Login Related API End Point
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/getLoginStatus", getLoginStatus);

//!User Related API End Point
router.get("/getuser", Auth, getUser);
router.patch("/updateUser",  Auth, updateUser);
router.patch("/updatePhoto",  Auth, updatePhoto);

//!Password Related API End Point
router.patch("/changepassword", Auth, changePassword);
//router.post("/forgotpassword", forgotPassword);
//router.put("/resetpassword/:resetToken", resetPassword);


module.exports = router;