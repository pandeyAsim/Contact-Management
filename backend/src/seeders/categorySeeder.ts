import { Category } from "../models";
import { generateUniqueSlug } from "../utils/helper";

const seedCategories = async (): Promise<void> => {
  try {
    console.log("🌱 Seeding categories...");

    const categories = [
      { name: "Family" },
      { name: "Friends" },
      { name: "Work" },
      { name: "Business" },
      { name: "School" },
      { name: "Emergency" },
      { name: "Healthcare" },
      { name: "Services" },
    ];

    for (const categoryData of categories) {
      const existingCategory = await Category.findOne({
        where: { name: categoryData.name },
      });

      if (!existingCategory) {
        const slug = await generateUniqueSlug({
          model: Category,
          text: categoryData.name,
        });

        const category = await Category.create({
          ...categoryData,
          slug,
        });

        console.log(`✅ Created category: ${category.name} (${category.slug})`);
      } else {
        console.log(`⏭️  Category already exists: ${categoryData.name}`);
      }
    }

    console.log("🎉 Categories seeding completed!\n");
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    throw error;
  }
};

export default seedCategories;
