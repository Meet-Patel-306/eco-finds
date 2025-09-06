import { db } from "@/db";
import { products } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export const createProduct = async (data: {
	title: string;
	description: string;
	price: number;
	category:
		| "electronics"
		| "other"
		| "books"
		| "fashion"
		| "home"
		| "toys"
		| "sports";
	imageUrl: string;
}) => {
	const { userId } = await auth();

	if (!userId) {
		return { success: false, message: "Unauthorized" };
	}

	try {
		const newProduct = await db
			.insert(products)
			.values({
				...data,
				ownerId: userId,
			})
			.returning();

		return {
			success: true,
			message: "Product Added",
			data: { productId: newProduct[0].id },
		};
	} catch (error) {
		return { success: false, message: "Something went Wrong!" };
	}
};

export const getProduct = async ({ id }: { id: string }) => {
	const { userId } = await auth();

	if (!userId) {
		return { success: false, message: "Unauthorized" };
	}

	try {
		const product = await db.select().from(products).where(eq(products.id, id));

		return {
			success: true,
			message: "Product Recieved",
			data: { product: product[0] },
		};
	} catch (error) {
		return { success: false, message: "Something went Wrong!" };
	}
};

// export const updateProduct = async (data: {
// 	title?: string;
// 	description?: string;
// 	price: number;
// 	category?:
// 		| "electronics"
// 		| "other"
// 		| "books"
// 		| "fashion"
// 		| "home"
// 		| "toys"
// 		| "sports";
// 	imageUrl?: string;
// 	createdAt?: string;
// 	updatedAt?: string;
// }) => {
// 	const { userId } = await auth();

// 	if (!userId) {
// 		return { success: false, message: "Unauthorized" };
// 	}

// 	try {
// 		const product = await db
// 			.update(products)
// 			.set({ ...data })
// 			.returning();

// 		return {
// 			success: true,
// 			message: "Product Recieved",
// 			data: { productid: product.id },
// 		};
// 	} catch (error) {
// 		return { success: false, message: "Something went Wrong!" };
// 	}
// };

export const deleteProduct = async ({ id }: { id: string }) => {
	const { userId } = await auth();

	if (!userId) {
		return { success: false, message: "Unauthorized" };
	}

	try {
		const product = await db
			.delete(products)
			.where(and(eq(products.id, id), eq(products.ownerId, userId)));

		return {
			success: true,
			message: "Product Deleted",
		};
	} catch (error) {
		return { success: false, message: "Something went Wrong!" };
	}
};
