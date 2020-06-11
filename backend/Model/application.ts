let mongooose = require('mongoose');
let applicationSchema = mongooose.Schema({
  id: String,
  status: String,
  module: [],
  student: [],
  responsible: String,
});

let Application = mongooose.model('Application', applicationSchema);
module.exports = Application;
