const mongoose = require('mongoose');



const classSchema = new mongoose.Schema({
    name: { type: String },
    year: { type: String },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    studentFees: { type: String },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    studentLimit: { type: String }
  });


const Class = mongoose.model('Class', classSchema);
module.exports = Class