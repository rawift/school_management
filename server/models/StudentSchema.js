const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema({
  name: { type: String },
  gender: { type: String },
  dateOfBirth: { type: String },
  phone: { type: String },
  email: { type: String },
  password: { type: String, required: true },
  userType: { type: String, default:"student"},
  feePaid: { type: Number },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }]
});



const Student = mongoose.model('Student', studentSchema);
module.exports = Student