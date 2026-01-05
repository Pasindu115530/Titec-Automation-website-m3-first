import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    role: String,
    isBlocked: Boolean,
    isEmailVerified: Boolean,
    image: String
});

const User = mongoose.model("User", userSchema);

async function createAdminUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");

        // Admin user details
        const adminData = {
            email: "admin@titec.com",
            firstName: "Admin",
            lastName: "User",
            password: "admin123", // Change this to a secure password
            role: "admin",
            isBlocked: false,
            isEmailVerified: true,
            image: "/default.jpg"
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log("Admin user already exists!");
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        adminData.password = hashedPassword;

        // Create admin user
        const admin = new User(adminData);
        await admin.save();

        console.log("✅ Admin user created successfully!");
        console.log("Email:", adminData.email);
        console.log("Password: admin123");
        console.log("\n⚠️  IMPORTANT: Change the password after first login!");

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin user:", error);
        process.exit(1);
    }
}

createAdminUser();
