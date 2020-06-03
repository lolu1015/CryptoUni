let moduleSchema = mongoose.Schema({
  name: String,
  professor: String,
  description: String
});

let Module = mongoose.model('Module', moduleSchema);
