const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    const adminEmail = "admin@pathologylab.com";

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("Admin account already exists:");
      console.log(existingAdmin.email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      "Admin@12345",
      10
    );

    const admin = await User.create({
      name: "System Administrator",
      email: adminEmail,
      password: hashedPassword,
      phone: "+919876543213",
      department: "Administration",
      role: "ADMIN",
      status: "ACTIVE",
      profile: {
        designation: "System Administrator",
        employeeId: "ADMIN-001",
      },
    });

    console.log("Admin account created successfully");

    console.log({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: admin.status,
    });

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }
};

createAdmin();
