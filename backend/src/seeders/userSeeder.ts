import { User } from "../models";
import bcrypt from "bcrypt";

const seedUsers = async (): Promise<void> => {
  try {
    console.log("🌱 Seeding users...");

    const users = [
      {
        email: "admin@example.com",
        password: "Admin123!",
        fullName: "System Administrator",
        roleId: 1, // admin
        isEmailVerified: true,
      },
      {
        email: "editor@example.com",
        password: "Editor123!",
        fullName: "Content Editor",
        roleId: 3, // editor
        isEmailVerified: true,
      },
      {
        email: "user@example.com",
        password: "User123!",
        fullName: "Regular User",
        roleId: 2, // user
        isEmailVerified: true,
      },
      {
        email: "john.doe@example.com",
        password: "John123!",
        fullName: "John Doe",
        roleId: 2, // user
        isEmailVerified: true,
      },
      {
        email: "jane.smith@example.com",
        password: "Jane123!",
        fullName: "Jane Smith",
        roleId: 2, // user
        isEmailVerified: false,
      },
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({
        where: { email: userData.email },
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await User.create({
          ...userData,
          password: hashedPassword,
        });
        console.log(`✅ Created user: ${user.email} (${user.fullName})`);
      } else {
        console.log(`⏭️  User already exists: ${userData.email}`);
      }
    }

    console.log("🎉 Users seeding completed!\n");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
};

export default seedUsers;
