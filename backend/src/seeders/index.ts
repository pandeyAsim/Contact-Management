import "../config/env.config"; // Load environment variables
import { connectDb } from "../config/db.config";
import seedRoles from "./roleSeeder";
import seedUsers from "./userSeeder";
import seedCategories from "./categorySeeder";
import seedContacts from "./contactSeeder";

const runSeeders = async (): Promise<void> => {
  try {
    console.log("🚀 Starting database seeding...\n");

    // Connect to database
    await connectDb();

    // Run seeders in order (roles first, then users, categories, contacts)
    await seedRoles();
    await seedUsers();
    await seedCategories();
    await seedContacts();

    console.log("🎊 All seeders completed successfully!");
    console.log("📝 You can now use the following test accounts:");
    console.log("   Admin: admin@example.com / Admin123!");
    console.log("   Editor: editor@example.com / Editor123!");
    console.log("   User: user@example.com / User123!");
    
    process.exit(0);
  } catch (error) {
    console.error("💥 Seeding failed:", error);
    process.exit(1);
  }
};

// Run seeders if this file is executed directly
if (require.main === module) {
  runSeeders();
}

export default runSeeders;
