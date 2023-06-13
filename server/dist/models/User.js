import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
config();
mongoose
    .connect(process.env.MONGOURL)
    .then((response) => console.log("Connected successfully"));
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        enum: ["Active", "Pending"],
        type: String,
        default: "Pending",
    },
    confirmCode: {
        type: String,
        required: true,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    cover: {
        type: String,
        default: "/images/OH-IMG.jpg",
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
UserSchema.pre("save", function (next) {
    if (this.isNew || this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});
const User = mongoose.model("User", UserSchema);
export default User;
