"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Loader, AlertCircle, Eye, EyeOff } from "lucide-react";

const signUpSchema = z
  .object({
    email: z
      .email({ message: "Please enter a valid email address." })
      .min(1, { message: "Email Id is required." }),
    password: z
      .string()
      .min(1, { message: "Password is required." })
      .min(8, { message: "Password must be at least 8 characters" }),
    passwordConfirmation: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export default function SingUpForm() {
  const otpSchema = z.object({
    pin: z.string().min(6, {
      message: "Your one-time password must be 6 characters.",
    }),
  });

  const [isView, setIsView] = useState(false);
  const [isView2, setIsView2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  //sign up
  const [authError, setAuthError] = useState<string | null>(null);
  const [verify, setVerify] = useState(false);
  //otp verify
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const { signUp, isLoaded, setActive } = useSignUp();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      pin: "",
    },
  });
  const onSubmitForm: SubmitHandler<z.infer<typeof signUpSchema>> = async (
    data
  ) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setVerify(true);
    } catch (err: any) {
      //console.log(err);
      setAuthError(
        err.errors?.[0]?.message || err.message || "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleVerificationSubmit: SubmitHandler<
    z.infer<typeof otpSchema>
  > = async (data) => {
    if (!isLoaded || !verify) return;
    setIsSubmitting(true);
    setVerifyError(null);
    try {
      const res = await signUp.attemptEmailAddressVerification({
        code: data.pin,
      });
      //console.log(res);
      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
      } else {
        //console.log("err ", res);
      }
    } catch (err: any) {
      //console.log(err);
      setVerifyError(
        err.errors?.[0]?.message || err.message || "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  if (verify) {
    return (
      <>
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          {isSubmitting ? (
            <div className="w-full h-full flex justify-center items-center">
              <Loader className="mr-2 h-10 w-10 animate-spin" />
            </div>
          ) : (
            <div className="w-full flex justify-center border-gray-200 dark:border-gray-700 py-4 px-2 rounded-3xl">
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-default-900 mb-0">
                  Verify Your Email
                </h1>
                <p className="mt-0 text-default-500 text-center">
                  We've sent a verification code to your email
                </p>
                {verifyError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{verifyError}</AlertDescription>
                  </Alert>
                )}
                <Form {...otpForm}>
                  <form
                    onSubmit={otpForm.handleSubmit(handleVerificationSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={otpForm.control}
                      name="pin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>One-Time Password</FormLabel>
                          <FormControl>
                            <InputOTP maxLength={6} {...field}>
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </div>
            </div>
          )}
        </div>
      </>
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
          <div className="w-full flex justify-center ">
            <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl space-y-6 border-2 border-gray-200 dark:border-gray-700 py-6 px-4 sm:px-8 rounded-3xl shadow-md bg-white dark:bg-gray-950">
              <h1 className="text-2xl font-bold text-center">
                Create Your Account
              </h1>
              {authError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitForm)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="xyz@gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={`${isView ? "text" : "password"}`}
                              placeholder="********"
                              {...field}
                            />
                            {isView ? (
                              <Eye
                                className="absolute right-4 top-2 z-10 cursor-pointer text-gray-500"
                                onClick={() => {
                                  setIsView(!isView);
                                }}
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

                  <FormField
                    control={form.control}
                    name="passwordConfirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={`${isView2 ? "text" : "password"}`}
                              placeholder="********"
                              {...field}
                            />
                            {isView2 ? (
                              <Eye
                                className="absolute right-4 top-2 z-10 cursor-pointer text-gray-500"
                                onClick={() => {
                                  setIsView2(!isView2);
                                }}
                              />
                            ) : (
                              <EyeOff
                                className="absolute right-4 top-2 z-10 cursor-pointer text-gray-500"
                                onClick={() => setIsView2(!isView2)}
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div id="clerk-captcha" className="mb-4" />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
