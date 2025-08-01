import { Role } from "../models";

const seedRoles = async (): Promise<void> => {
  try {
    console.log("🌱 Seeding roles...");

    const roles = [
      { id: 1, title: "admin" },
      { id: 2, title: "user" },
      { id: 3, title: "editor" },
    ];

    for (const roleData of roles) {
      const [role, created] = await Role.findOrCreate({
        where: { id: roleData.id },
        defaults: roleData,
      });

      if (created) {
        console.log(`✅ Created role: ${role.title}`);
      } else {
        console.log(`⏭️  Role already exists: ${role.title}`);
      }
    }

    console.log("🎉 Roles seeding completed!\n");
  } catch (error) {
    console.error("❌ Error seeding roles:", error);
    throw error;
  }
};

export default seedRoles;
