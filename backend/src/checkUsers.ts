import { User } from "./models";
import sequelize from "./config/db.config";
import bcrypt from "bcrypt";

const checkUsers = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    const users = await User.findAll({
      attributes: ['id', 'email', 'password', 'isEmailVerified'],
      include: ['role']
    });

    console.log("Found users:", users.length);
    
    for (const user of users) {
      console.log(`\nUser: ${user.email}`);
      console.log(`Email verified: ${user.isEmailVerified}`);
      console.log(`Role: ${user.role?.title || 'No role'}`);
      
      // Test password validation for common passwords
      const testPasswords = ['Admin123!', 'User123!', 'Test123!', 'password'];
      
      for (const testPassword of testPasswords) {
        try {
          const isValid = await bcrypt.compare(testPassword, user.password);
          if (isValid) {
            console.log(`✅ Password "${testPassword}" works for ${user.email}`);
            break;
          }
        } catch (error) {
          console.log(`❌ Error testing password "${testPassword}": ${error}`);
        }
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

checkUsers();
