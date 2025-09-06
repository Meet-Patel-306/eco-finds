import { db } from "@/db";
import { carts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export const addToCart = async (data: {
	productId: string;
	quantity: number;
}) => {
	const { userId } = await auth();

	if (!userId) {
		return { success: false, message: "Unauthorized" };
	}

	try {
		const newProduct = await db
			.insert(carts)
			.values({
				...data,
				userId,
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

export const getCart = async () => {
	const { userId } = await auth();

	if (!userId) {
		return { success: false, message: "Unauthorized" };
	}

	try {
		const cartProducts = await db
			.select()
			.from(carts)
			.where(eq(carts.userId, userId));

		return {
			success: true,
			message: "Product received",
			data: { product: cartProducts },
		};
	} catch (error) {
		return { success: false, message: "Something went Wrong!" };
	}
};

// export const updateCartProduct = async (data: {
// 	productId: string;
// 	quantity: string;
// }) => {
// 	const { userId } = await auth();

// 	if (!userId) {
// 		return { success: false, message: "Unauthorized" };
// 	}

// 	try {
// 		const product = await db
// 			.update(carts)
// 			.set({ ...data })
// 			.where(eq(carts.userId, userId))
// 			.returning();

// 		return {
// 			success: true,
// 			message: "Cart Updated",
// 			data: { productid: product.id },
// 		};
// 	} catch (error) {
// 		return { success: false, message: "Something went Wrong!" };
// 	}
// };

export const deleteCartProduct = async ({ id }: { id: string }) => {
	const { userId } = await auth();

	if (!userId) {
		return { success: false, message: "Unauthorized" };
	}

	try {
		const product = await db
			.delete(carts)
			.where(and(eq(carts.id, id), eq(carts.userId, userId)));

		return {
			success: true,
			message: "Cart Product Deleted",
		};
	} catch (error) {
		return { success: false, message: "Something went Wrong!" };
	}
};
