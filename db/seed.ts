import { db } from "./index";
import { products } from "./schema";
import { faker } from "@faker-js/faker";

async function seed() {
	try {
		// Insert 10 products
		const sampleProducts = Array.from({ length: 10 }).map(() => ({
			title: faker.commerce.productName(),
			description: faker.commerce.productDescription(),
			price: parseInt(faker.commerce.price({ min: 100, max: 5000 }), 10),
			category: faker.helpers.arrayElement([
				"electronics",
				"fashion",
				"books",
				"home",
				"toys",
				"sports",
				"other",
			]),
			imageUrl: faker.image.urlLoremFlickr({ category: "product" }),
			ownerId: faker.string.uuid(), // random userId
		}));

		await db.insert(products).values(sampleProducts);

		console.log("✅ Seed completed: inserted 10 products");
		process.exit(0);
	} catch (err) {
		console.error("❌ Error seeding data:", err);
		process.exit(1);
	}
}

seed();
