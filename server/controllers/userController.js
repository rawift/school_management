const Student = require("../models/StudentSchema");
const Teacher = require("../models/TeacherSchema");
const Admin = require("../models/AdminSchema")
const Class = require("../models/ClassSchema")

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");





const signup = async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    let user;
    const existingStudent = await Student.findOne({ email });
    const existingTeacher = await Teacher.findOne({ email });

    if (existingStudent || existingTeacher) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password);
    if (userType === 'student') {
      user = new Student({ email, password:hashedPassword }); 
      await user.save();
    } else if (userType === 'teacher') {
      user = new Teacher({ email, password:hashedPassword })
      await user.save();
    } else if (userType ==='admin'){
      user = new Admin({ email, password:hashedPassword })
      await user.save();
    }else{
      return res.status(400).json({ message: 'Invalid user type' });
    }

    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const login = async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    let user;

    if (userType === 'student') {
      const existingStudent = await Student.findOne({ email });
      if (!existingStudent) {
        return res.status(400).json({ message: 'Student does not exists' });
      }
      const isPasswordCorrect = bcrypt.compareSync(password, existingStudent.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Inavlid Email / Password" });
      }
      user=existingStudent
    } else if (userType === 'teacher') {
      const existingTeacher = await Teacher.findOne({ email });
      if (!existingTeacher) {
        return res.status(400).json({ message: 'Teacher does not exists' });
      }
      const isPasswordCorrect = bcrypt.compareSync(password, existingTeacher.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Inavlid Email / Password" });
      }
      user=existingTeacher
    } else if(userType === 'admin') {
      const existingAdmin = await Admin.findOne({ email });
      if (!existingAdmin) {
        return res.status(400).json({ message: 'Admin does not exists' });
      }
      const isPasswordCorrect = bcrypt.compareSync(password, existingAdmin.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Inavlid Email / Password" });
      }
      user=existingAdmin
    }else{
      return res.status(400).json({ message: 'Invalid user type' });
    }
    const existingUser=user
    const token = jwt.sign({ user: existingUser }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.cookie('token', token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 3600), 
      httpOnly: true,
      sameSite: "lax",
    });
  
    return res
      .status(200)
      .json({ message: "Successfully Logged In", user: existingUser, token });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const verifyToken = async (req, res, next) => {
  try {
    console.log("verify")
    const token = req.cookies.token;

    if (!token) {
      console.log("No token found");
      return res.status(404).json({ message: "No token found" });
    }



    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        console.log("Invalid token");
        return res.status(400).json({ message: "Invalid token" });
      }

      req.user = user.user;
      next();
    });

  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};







const getUser = async (req, res, next) => {
  try {
    console.log("getuser")
    let user=req.user
    if(user.userType=='student'){
      user = await Student.findById(user._id);
    }else if(user.userType=='teacher'){
      user = await Teacher.findById(user._id);
    }else if(user.userType=='admin'){
      user = await Admin.findById(user._id);
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
  
};


const logout = (req, res, next) => {
  res.clearCookie('token', {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};



const form = async(req,res) =>{
  try {
    const {name, gender, dateOfBirth, phone, feePaid, salary } = req.body
    const user = req.user
    let updateduser
    if(user.userType=='student'){
      updateduser = await Student.findByIdAndUpdate(user._id, {name,gender,dateOfBirth,phone,feePaid}, { new: true, runValidators: true });
    }else if(user.userType=='teacher'){
      updateduser = await Teacher.findByIdAndUpdate(user._id, {name,gender,dateOfBirth,phone,salary}, { new: true, runValidators: true });
    }
    res.status(200).json(updateduser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


const getTeacher = async(req,res) =>{
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const myClass = async (req, res) => {
  try {
    const user = req.user; 
    let userType = user.userType;
    let userId = user._id;
    let classDetails;

    if (userType === 'student') {
    
      const existingStudent = await Student.findById(userId);
      if (!existingStudent) {
        return res.status(400).json({ message: 'Student does not exist' });
      }


      classDetails = await Promise.all(
        existingStudent.classes.map(async (classId) => {
          return await Class.findById(classId); 
        })
      );
      
    } else if (userType === 'teacher') {

      const existingTeacher = await Teacher.findById(userId);
      if (!existingTeacher) {
        return res.status(400).json({ message: 'Teacher does not exist' });
      }

      classDetails = await Promise.all(
        existingTeacher.assignedClasses.map(async (classId) => {
          return await Class.findById(classId); 
        })
      );
    }

    console.log(classDetails)


    res.status(200).json({ classes: classDetails });
  } catch (error) {
    console.error('Error fetching myClass:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const studentProfile = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const student = await Student.findById(userId).populate('classes'); 
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
  
};

const TeacherProfile = async (req, res, next) => {
  try {
    try {
      const { userId } = req.body;
  
      const teacher = await Teacher.findById(userId).populate('assignedClasses'); 
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
  
      res.status(200).json(teacher);
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
  
};



const calculateExpensesAndIncome = (teachers, students, month, year) => {
  let totalSalary = 0;
  let totalFee = 0;

  teachers.forEach(teacher => {
    totalSalary += teacher.salary || 0;
  });

  students.forEach(student => {
    if (student.feePaid) {
      totalFee += student.feePaid;
    }
  });

  return {
    totalSalary,
    totalFee,
  };
};

const analytics =async(req,res) =>{
  const { view, month, year } = req.query;

  try {
    const teachers = await Teacher.find({}).exec();
    const students = await Student.find({}).exec();

    let expensesAndIncome;

    if (view === 'monthly') {
      expensesAndIncome = calculateExpensesAndIncome(teachers, students, month, year);
    } else if (view === 'yearly') {
      expensesAndIncome = calculateExpensesAndIncome(teachers, students, null, year);
    } else {
      return res.status(400).json({ message: 'Invalid view type' });
    }

    res.json({
      totalSalary: expensesAndIncome.totalSalary,
      totalFee: expensesAndIncome.totalFee,
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


exports.form = form;
exports.logout = logout;
exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.getTeacher = getTeacher;
exports.myClass = myClass
exports.studentProfile = studentProfile
exports.TeacherProfile = TeacherProfile
exports.analytics = analytics

