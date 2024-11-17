import mongoose from "mongoose";
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  Pwd: { type: String, required: true },
});

userSchema.plugin(AutoIncrement, { inc_field: "sno" });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
