import mongoose from "mongoose";
import User from "../models/user.model.js";

const insertAdminUser = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/your_db_name");

    const existingUser = await User.findOne({ email: "admin@gmail.com" });
    if (existingUser) {
      console.log("Admin already exists");
      return;
    }

    const user = new User({
      username: "admin",
      email: "admin@gmail.com",
      password: "123456"
    });

    await user.save();

    console.log("Admin user inserted");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

insertAdminUser();