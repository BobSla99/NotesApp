const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGODB_URL;

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then((res) => console.log("connected to db"))
  .catch((err) => console.log("no se pudo connectar al sever", err));

const noteScheme = new mongoose.Schema({
  content: { type: String, minLength: 5, require: true },
  important: Boolean,
});

noteScheme.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("Note", noteScheme);
