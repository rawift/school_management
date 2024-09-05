const express = require("express");
const {
  signup,
  login,
  verifyToken,
  getUser,
  logout,
  form,
  getTeacher,
  myClass,
  studentProfile,
  TeacherProfile,
  analytics,
} = require("../controllers/userController");


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/form", verifyToken, form);
router.get("/me", verifyToken, getUser);
router.get("/logout", verifyToken, logout);
router.get("/getTeacher", getTeacher)
router.get("/myClass",verifyToken,myClass)
router.post("/studentProfile",studentProfile)
router.post("/teacherProfile",TeacherProfile)
router.get("/analytics",verifyToken,analytics)


module.exports = router;
