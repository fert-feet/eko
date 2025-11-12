"use client";

import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useQuery } from "convex/react";
import { MoreHorizontalIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod/v4";

const ConversationIdView = ({
    conversationId
}: {
    conversationId: Id<"conversations">;
}) => {
    const conversation = useQuery(api.private.conversations.getOne, { conversationId });

    const formSchema = z.object({
        message: z.string().min(1, "Message is Required")
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: ""
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
    }

    return (

        <div className="flex h-full flex-col bg-muted">
            <header className="flex items-center justify-between border-b bg-background p-2.5">
                <Button
                    size={"sm"}
                    variant={"ghost"}
                >
                    <MoreHorizontalIcon />
                </Button>
            </header>
        </div>
    );
};

export default ConversationIdView;