import "../config/env.config";
import { connectDb } from "../config/db.config";
import { User, Role } from "../models";

const checkUsers = async () => {
  try {
    await connectDb();
    
    const users = await User.findAll({
      include: [
        {
          model: Role,
          attributes: ["id", "title"],
        },
      ],
    });

    console.log("=== ALL USERS IN DATABASE ===");
    users.forEach(user => {
      console.log(`ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Full Name: ${user.fullName}`);
      console.log(`Role: ${user.role?.title}`);
      console.log(`Email Verified: ${user.isEmailVerified}`);
      console.log(`Created: ${user.createdAt}`);
      console.log("---");
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

checkUsers();
