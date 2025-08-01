import "../config/env.config";
import { connectDb } from "../config/db.config";
import { User } from "../models";
import bcrypt from "bcrypt";

const resetPassword = async (email: string, newPassword: string) => {
  try {
    await connectDb();
    
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log(`User ${email} not found`);
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });
    
    console.log(`Password updated for ${email}`);
    console.log(`New password: ${newPassword}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

// Reset password for darshangotame@gmail.com
resetPassword("darshangotame@gmail.com", "Test123!");
