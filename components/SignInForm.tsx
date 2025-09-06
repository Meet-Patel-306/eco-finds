"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/nextjs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Loader, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function SignInForm() {
  const signInSchema = z.object({
    // email
    identifier: z
      .string()
      .min(1, { message: "Email or username is required." })
      .email({ message: "Please enter a valid email address." }),
    password: z.string().min(1, { message: "Password is required." }),
  });
  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const { signIn, isLoaded, setActive } = useSignIn();
  const { isSignedIn, user } = useUser();
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isView, setIsView] = useState(false);

  const onSubmitSignIn: SubmitHandler<z.infer<typeof signInSchema>> = async (
    data
  ) => {
    if (!isLoaded) return;
    setSignInError(null);
    setIsSubmitting(true);
    try {
      const res = await signIn?.create({
        identifier: data.identifier,
        password: data.password,
      });
      if (res.status === "complete") {
        await setActive({ session: res?.createdSessionId });
        //console.log("ok", res);
      } else {
        //console.log("faile");
      }
    } catch (err: any) {
      setSignInError(err.errors?.[0].message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isSignedIn) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader className="mr-2 h-10 w-10 animate-spin" />
      </div>
    );
  }
  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        {isSubmitting ? (
          <div className="w-full h-full flex justify-center items-center">
            <Loader className="mr-2 h-10 w-10 animate-spin" />
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl space-y-6 border-2 border-gray-200 dark:border-gray-700 py-6 px-4 sm:px-8 rounded-3xl shadow-md bg-white dark:bg-gray-950">
              <h1 className="text-2xl font-bold text-center">
                Sign In to Your Account
              </h1>

              {signInError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{signInError}</AlertDescription>
                </Alert>
              )}

              <Form {...signInForm}>
                <form
                  onSubmit={signInForm.handleSubmit(onSubmitSignIn)}
                  className="space-y-6 "
                >
                  {/* Email */}
                  <FormField
                    control={signInForm.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="xyz@gmail.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={isView ? "text" : "password"}
                              placeholder="********"
                              {...field}
                            />
                            {isView ? (
                              <Eye
                                className="absolute right-4 top-2 z-10 cursor-pointer text-gray-500"
                                onClick={() => setIsView(!isView)}
                              />
                            ) : (
                              <EyeOff
                                className="absolute right-4 top-2 z-10 cursor-pointer text-gray-500"
                                onClick={() => setIsView(!isView)}
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    Submit
                  </Button>

                  {/* Link */}
                  <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/sign-up"
                      className="underline underline-offset-4"
                    >
                      Sign up
                    </Link>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
