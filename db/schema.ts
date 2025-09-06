import {
	pgTable,
	varchar,
	text,
	integer,
	timestamp,
	pgEnum,
	uuid,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", [
	"electronics",
	"fashion",
	"books",
	"home",
	"toys",
	"sports",
	"other",
]);

export const products = pgTable("products", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description"),
	price: integer("price").notNull(),
	category: categoryEnum("category").notNull(),
	imageUrl: text("image_url"),
	ownerId: varchar("owner_id", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const carts = pgTable("carts", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	productId: uuid("product_id")
		.references(() => products.id)
		.notNull(),
	quantity: integer("quantity").default(1).notNull(),
	addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const purchases = pgTable("purchases", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	productId: uuid("product_id")
		.references(() => products.id)
		.notNull(),
	purchasedAt: timestamp("purchased_at").defaultNow().notNull(),
});
