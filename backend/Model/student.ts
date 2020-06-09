let mongoose = require('mongoose');
let studentSchema = mongoose.Schema({
  name: String,
  id: String,
  password: String,
  modules: []
}, { collection: 'students' });
let Student = mongoose.model('Student', studentSchema);
module.exports = Student;
