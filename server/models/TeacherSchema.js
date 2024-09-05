const mongoose = require('mongoose');


const teacherSchema = new mongoose.Schema({
    name: { type: String },
    gender: { type: String },
    dateOfBirth: { type: String },
    phone: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salary: { type: Number },
    userType: { type: String, default:"teacher"},
    assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }]
  });
  

const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;