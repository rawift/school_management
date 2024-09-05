const Class = require("../models/ClassSchema")
const Student = require("../models/StudentSchema")
const Teacher = require("../models/TeacherSchema")


const create =async(req,res) => {
    try {
        if(!req.user.userType=='admin'){
            res.status(401).json({ message: 'Access Denied only for admins'});
        }
        const { name, year, studentLimit } = req.body;
        if (!name || !year || !studentLimit) {
            return res.status(400).json({ message: 'All fields are required' });
          }
          const newClass = new Class({ name, year, studentLimit,
          });
          await newClass.save();
          res.status(201).json({ message: 'Class created successfully', class: newClass });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const allclass = async(req,res) =>{
    try {
       
        if(!req.user.userType=='admin'){
            res.status(401).json({ message: 'Access Denied only for admins'});
        }

        const { page = 1, limit = 20 } = req.query;
    
        const classes = await Class.find()
          .populate('teacher', 'name')
          .skip((page - 1) * limit)
          .limit(Number(limit));
    
        const totalClasses = await Class.countDocuments();
    
        res.status(200).json({
          classes,
          totalPages: Math.ceil(totalClasses / limit),
          currentPage: Number(page),
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
}



const deleteClass = async (req, res) => {
  try {

    if (req.user.userType !== 'admin') {
      return res.status(401).json({ message: 'Access Denied, only for admins' });
    }

    const { id } = req.params;


    const classToDelete = await Class.findById(id);
    if (!classToDelete) {
      return res.status(404).json({ message: "Class not found" });
    }


    const studentsInClass = await Student.find({ classes: id });


    await Promise.all(studentsInClass.map(async (student) => {
      student.classes = student.classes.filter(classId => classId.toString() !== id);
      await student.save();
    }));


    await Class.findByIdAndDelete(id);

    res.status(200).json({ message: "Class and associated references deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const singleclass = async (req, res) => {
  try {
  
    const classData = await Class.findById(req.params.id)
      .populate({
        path: 'teacher',
        select: 'name email' 
      })
      .populate({
        path: 'students',
        select: 'name email gender' 
      });


    res.status(200).json(classData);
  } catch (err) {
   
    res.status(500).json({ message: err.message });
  }
};



const enrollclass = async(req,res) => {
  try {
    const classId = req.params.id;  
    const studentId = req.user._id; 
    const student = await Student.findById(studentId);
    const classData = await Class.findById(classId);

    if (classData.students.includes(studentId)) {
      return res.status(400).json({ message: 'Student already enrolled in this class.' });
    }

    if (classData.students.length >= parseInt(classData.studentLimit)) {
      return res.status(400).json({ message: 'Student limit for this class has been reached.' });
    }
    classData.students.push(studentId);
    const studentFee = parseFloat(student.feePaid) || 0;
    classData.studentFees = (parseFloat(classData.studentFees) || 0) + studentFee;

    await classData.save();


    student.classes.push(classId);
    await student.save();

    return res.status(200).json({ message: 'Student added to class and fees updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}  


const assignTeacher = async(req,res) =>{
  try {

    if(!req.user.userType=='admin'){
      res.status(401).json({ message: 'Access Denied only for admins'});
  }
   const { teacherId } = req.body
   const classId = req.params.id;  
    const teacher = await Teacher.findById(teacherId);
    const classData = await Class.findById(classId);
    if (teacher.assignedClasses.includes(classId)) {
      return res.status(400).json({ message: 'Teacher already assigned to this' });
    }
    teacher.assignedClasses.push(classId)
    await teacher.save()
    classData.teacher=teacherId
    await classData.save()
    return res.status(200).json({ message: 'Teacher assigned' });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


const removeTeacher = async (req, res) => {
  try {

    if (req.user.userType !== 'admin') {
      return res.status(401).json({ message: 'Access Denied only for admins' });
    }

    const { teacherId } = req.body;
    const classId = req.params.id;

 
    const teacher = await Teacher.findById(teacherId);
    const classData = await Class.findById(classId);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }


    teacher.assignedClasses = teacher.assignedClasses.filter(classId => !classId.equals(classData._id));
    await teacher.save();


    classData.teacher = null;
    await classData.save();

    return res.status(200).json({ message: 'Teacher removed and class updated' });
  } catch (error) {
    console.error('Error removing teacher:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.create=create
exports.allclass=allclass
exports.deleteClass=deleteClass
exports.singleclass=singleclass
exports.enrollclass=enrollclass
exports.assignTeacher=assignTeacher
exports.removeTeacher=removeTeacher