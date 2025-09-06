"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";
import { NavMenu } from "./NavMenu";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { UserButton } from "../user-button";

export function Navbar() {
  return (
    <nav className="block top-6 inset-x-4 z-50 h-16 bg-neutral-900 text-white backdrop-blur-sm border border-neutral-300 max-w-screen-xl mx-auto rounded-full shadow-lg">
      <div className="h-full flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <NavMenu className="text-neutral-200" />
          <UserButton />
          {/* <Button
            variant="outline"
            className="hidden sm:inline-flex rounded-full border-neutral-700 text-white hover:bg-white hover:bg-"
          >
            Sign In
          </Button>
          <Button className="rounded-full bg-white text-black hover:bg-neutral-300">
            Get Started
          </Button> */}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-neutral-700 text-white hover:bg-neutral-800"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-neutral-900 text-white border-neutral-800">
              {/* Accessibility */}
              <VisuallyHidden>
                <DialogTitle>Navigation Menu</DialogTitle>
              </VisuallyHidden>
              <div className="mt-5 flex justify-center">
                <Logo />
              </div>

              <NavMenu
                orientation="vertical"
                className="mt-12 text-neutral-200"
              />
              <UserButton />
              {/* <div className="flex flex-col gap-4 mt-8">
                <Button
                  variant="outline"
                  className="rounded-full border-neutral-700 text-white hover:bg-neutral-800"
                >
                  Sign In
                </Button>
                <Button className="rounded-full bg-white text-black hover:bg-neutral-200">
                  Get Started
                </Button>
              </div> */}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
