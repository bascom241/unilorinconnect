import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from "bcryptjs";


const matricNumberRegex = /^[0-9]{2}\/[0-9]{2}[A-Z]{2}[0-9]{3}$/;

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please provide your Full name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please Provide Your Email"],
    unique: true,
    validate: {
      validator: function (email) {
        if (!email.endsWith("@students.unilorin.edu.ng")) return false;
        return validator.isEmail(email);
      },
      message: (props) =>
        `${props.value} is not a valid school email. Use your matric number with @students.unilorin.edu.ng`,
    },
  },
  matricNumber: {
    type: String,
    required: [true, "Please Provide Your Matric Number"],
    unique: true,
    trim: true,
    uppercase: true,
    match: [matricNumberRegex, "Invalid matric number format!"],
  },
  password: {
    type: String,
    required: [true, "Please Provide Your Password"],
    minlength: 6,
    select: false,
  },
  confirmPassword: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordExpiresDate: Date,
  verificationToken: String,
  verificationTokenExpiresDate: Date,
}, { timestamps: true });

// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   this.confirmPassword = undefined;
//   next();
// });

const User = mongoose.model("User", userSchema);
export default User;
