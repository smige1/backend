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

const Auth = require("../middleware/authHandler")


//Router PATH
//!SignUp & Login Related API End Point
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/loggedin", getLoginStatus);

//!User Related API End Point
router.get("/getuser", Auth, getUser);
router.patch("/updateuser", updateUser);
router.patch("/updatephoto", updatePhoto);

//!Password Related API End Point
router.patch("/changepassword", changePassword);
//router.post("/forgotpassword", forgotPassword);
//router.put("/resetpassword/:resetToken", resetPassword);


module.exports = router;