"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "./ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Upload from "./Upload";

const formSchema = z.object({
  title: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z
    .string()
    .min(1, { message: "Please write product description." }),
  price: z
    .number()
    .positive({ message: "Price must be not less than 0." })
    .min(0, { message: "Please enter price." }),
  category: z.enum([
    "electronics",
    "fashion",
    "books",
    "home",
    "toys",
    "sports",
    "other",
  ]),
  imageUrl: z.string().min(1, { message: "Please uplode product image." }),
});

type FormValues = z.infer<typeof formSchema>;

export function ProductAddForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "other",
      imageUrl: "",
    },
  });

  async function onSubmit(values: FormValues) {
    console.log(values);
    await toast.promise(
      fetch("/api/product/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to save product");
        return res.json();
      }),
      {
        loading: "Saving product...",
        success: "Product saved successfully!",
        error: "Failed to save product.",
      }
    );

    form.reset();
  }

  return (
    <div className="flex items-center justify-center text-neutral-100 mt-32">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-md w-full p-6 bg-neutral-900 rounded-2xl shadow border border-neutral-700"
        >
          {/* Name */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-200">
                  Product Title
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Product title"
                    {...field}
                    className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-400"
                  />
                </FormControl>
                <FormDescription className="text-neutral-400">
                  Enter your full name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-200">
                  Product description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your product description..."
                    {...field}
                    className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-200">Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter product price"
                    {...field}
                    className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-400"
                    min={0}
                    step={1} // ensures whole numbers
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value}
                  />
                </FormControl>
                <FormDescription className="text-neutral-400">
                  Enter the product price in whole numbers.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-200">Category</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="bg-neutral-800 border-neutral-700 text-neutral-100">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-neutral-800 text-neutral-100 border-neutral-700">
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-neutral-400">
                  Choose a category for your product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-200">
                  Product Image
                </FormLabel>
                <FormControl>
                  <Upload value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormDescription className="text-neutral-400">
                  Upload a product image (jpg, png, etc.).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-white hover:bg-gray-200 text-black"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
