import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema, model } = mongoose;

mongoose.connect("mongoDB URL");

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 25,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 25,
  },
  username: {
    type: String,
    required: true,
    immutable: true,
    trim: true,
    minLength: 5,
    maxLength: 25,
  },
  password_hash: {
    type: String,
    required: true,
    minLength: 8,
  },
});

userSchema.methods.createHash = async function (plainText) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(plainText, salt);
};

userSchema.methods.validatePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password_hash);
};

export const User = model("User", userSchema);

const accountSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
});

export const Account = model("Account", accountSchema);
