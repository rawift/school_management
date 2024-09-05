const express = require("express");
const {
  signup,
  login,
  verifyToken,
  getUser,
  logout,
  form,
} = require("../controllers/userController");
const { create, allclass, deleteClass, singleclass, enrollclass, assignTeacher, removeTeacher, } = require("../controllers/classController");



const router = express.Router();

router.post("/create", verifyToken ,create);
router.delete("/deleteclass/:id", verifyToken, deleteClass)

router.get("/allclass", verifyToken ,allclass);
router.get("/singleclass/:id", verifyToken, singleclass)

router.post("/enroll/:id",verifyToken, enrollclass)
router.post("/assignTeacher/:id",verifyToken,assignTeacher)
router.post("/removeTeacher/:id",verifyToken,removeTeacher)

module.exports = router;
