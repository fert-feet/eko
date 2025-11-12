"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { Form, FormField } from "@workspace/ui/components/form";
import { PromptInput, PromptInputFooter, PromptInputProvider, PromptInputSubmit, PromptInputTextarea, PromptInputTools } from "@workspace/ui/components/ai/prompt-input";
import { Response } from "@workspace/ui/components/ai/response";
import { api } from "@workspace/backend/_generated/api";
import { Conversation, ConversationContent } from "@workspace/ui/components/ai/conversation";
import { Message, MessageContent } from "@workspace/ui/components/ai/message";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useQuery } from "convex/react";
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod/v4";
import DicebearAvatar from "@workspace/ui/components/dicebear-avatar";
import { cn } from "@workspace/ui/lib/utils";
import { InputGroupButton } from "@workspace/ui/components/input-group";

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
    };

    const messages = useThreadMessages(
        api.private.message.getMany,
        conversation?.threadId ?
            {
                threadId: conversation.threadId,
            } :
            "skip",
        {
            initialNumItems: 10
        }
    );

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
            {/* conversation */}
            <Conversation>
                <ConversationContent>
                    {toUIMessages(messages.results ?? [])?.map((message) => (
                        <Message
                            from={message.role === "user" ? "assistant" : "user"}
                            key={message.id}
                        >
                            <MessageContent
                            className={cn(
                                message.role === "user" && "bg-background!"
                            )}
                            >
                                <Response>{message.text}</Response>
                            </MessageContent>
                            {message.role === "user" && (
                                <DicebearAvatar
                                    seed={conversation?.contactSessionId ?? "user"}
                                />
                            )}
                        </Message>
                    ))}
                </ConversationContent>
            </Conversation>
            <div className="p-2">
            <Form {...form}>
                <PromptInputProvider>
                    <PromptInput
                        className="bg-background"
                        onSubmit={(message) => {
                            form.setValue("message", message.text || "");
                            form.handleSubmit(onSubmit)();
                        }}
                    >
                        <FormField
                            control={form.control}
                            disabled={conversation?.status === "resolved"}
                            name="message"
                            render={({ field }) => (
                                <PromptInputTextarea
                                    onChange={field.onChange}
                                    placeholder={
                                        conversation?.status === "resolved"
                                            ? "This conversation has been resolved."
                                            : "Type your message..."
                                    }
                                    value={field.value}
                                />
                            )}
                        />
                        <PromptInputFooter>
                            <PromptInputTools>
                                <InputGroupButton>
                                    <Wand2Icon />
                                    <span>Enhance</span>
                                </InputGroupButton>
                            </PromptInputTools>
                            <PromptInputSubmit
                                disabled={conversation?.status === "resolved" || !form.formState.isValid}
                                status="ready"
                                type="submit"
                            />
                        </PromptInputFooter>
                    </PromptInput>
                </PromptInputProvider>
            </Form>
            </div>
        </div>
    );
};

export default ConversationIdView;