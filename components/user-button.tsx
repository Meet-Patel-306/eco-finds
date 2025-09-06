"use client";

import { SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { MoveRightIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";

export const UserButton = () => {
	const { user } = useUser();

	return (
		<div className="p-4">
			<SignedIn>
				<Popover>
					<PopoverTrigger>
						<Avatar>
							<AvatarImage src={user?.imageUrl} />
							<AvatarFallback>U</AvatarFallback>
						</Avatar>
					</PopoverTrigger>
					<PopoverContent className="bg-neutral-600 p-0">
						<Card>
							<CardContent>
								<p>{user?.primaryEmailAddress?.emailAddress}</p>

								<Dialog>
									<DialogTrigger asChild>
										<Button className="flex justify-start items-center gap-2 mt-2">
											Settings <MoveRightIcon size={18} />
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogTitle></DialogTitle>
										<p>{user?.primaryEmailAddress?.emailAddress}</p>
									</DialogContent>
								</Dialog>

								<SignOutButton>
									<Button size={"sm"} className="mt-2">
										Sign Out
									</Button>
								</SignOutButton>
							</CardContent>
						</Card>
					</PopoverContent>
				</Popover>
			</SignedIn>
			<SignedOut>
				<Link href={"/sign-in"}>
					<Button>Sign In</Button>
				</Link>
			</SignedOut>
		</div>
	);
};
