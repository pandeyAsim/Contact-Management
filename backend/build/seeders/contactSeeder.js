"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const seedContacts = async () => {
    try {
        console.log("🌱 Seeding contacts...");
        const users = await models_1.User.findAll();
        const categories = await models_1.Category.findAll();
        if (users.length === 0 || categories.length === 0) {
            console.log("⚠️  No users or categories found. Please seed users and categories first.");
            return;
        }
        const sampleContacts = [
            {
                fullName: "Alice Johnson",
                email: "alice.johnson@email.com",
                phoneNumber: "+1-555-0101",
                company: "Tech Solutions Inc",
                address: "123 Tech Street, Silicon Valley, CA 94000",
                gender: "female",
                department: "Engineering",
                notes: "Senior Software Engineer, React specialist",
                isStared: true,
            },
            {
                fullName: "Bob Williams",
                email: "bob.williams@email.com",
                phoneNumber: "+1-555-0102",
                company: "Marketing Pro",
                address: "456 Marketing Ave, New York, NY 10001",
                gender: "male",
                department: "Marketing",
                notes: "Digital marketing expert",
                isStared: false,
            },
            {
                fullName: "Carol Brown",
                email: "carol.brown@email.com",
                phoneNumber: "+1-555-0103",
                company: "Design Studio",
                address: "789 Creative Blvd, Los Angeles, CA 90210",
                gender: "female",
                department: "Design",
                notes: "UX/UI Designer with 5 years experience",
                isStared: true,
            },
            {
                fullName: "David Davis",
                email: "david.davis@email.com",
                phoneNumber: "+1-555-0104",
                company: "Finance Corp",
                address: "321 Money Street, Chicago, IL 60601",
                gender: "male",
                department: "Finance",
                notes: "Financial analyst",
                isStared: false,
            },
            {
                fullName: "Emma Wilson",
                email: "emma.wilson@email.com",
                phoneNumber: "+1-555-0105",
                company: "Healthcare Plus",
                address: "654 Health Ave, Miami, FL 33101",
                gender: "female",
                department: "Healthcare",
                notes: "Emergency contact - Family doctor",
                isStared: true,
            },
        ];
        for (let i = 0; i < sampleContacts.length; i++) {
            const contactData = sampleContacts[i];
            const userId = users[i % users.length].id;
            const categoryId = categories[Math.floor(Math.random() * categories.length)].id;
            const existingContact = await models_1.Contact.findOne({
                where: {
                    email: contactData.email,
                    userId: userId
                },
            });
            if (!existingContact) {
                const contact = await models_1.Contact.create({
                    ...contactData,
                    userId,
                    categoryId,
                });
                console.log(`✅ Created contact: ${contact.fullName} for user ${userId}`);
            }
            else {
                console.log(`⏭️  Contact already exists: ${contactData.fullName}`);
            }
        }
        console.log("🎉 Contacts seeding completed!\n");
    }
    catch (error) {
        console.error("❌ Error seeding contacts:", error);
        throw error;
    }
};
exports.default = seedContacts;
