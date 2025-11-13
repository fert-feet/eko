"use client";

import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@workspace/backend/_generated/api";
import { Doc, Id } from "@workspace/backend/_generated/dataModel";
import { Conversation, ConversationContent } from "@workspace/ui/components/ai/conversation";
import { Message, MessageContent } from "@workspace/ui/components/ai/message";
import { PromptInput, PromptInputFooter, PromptInputProvider, PromptInputSubmit, PromptInputTextarea, PromptInputTools } from "@workspace/ui/components/ai/prompt-input";
import { Response } from "@workspace/ui/components/ai/response";
import { Button } from "@workspace/ui/components/button";
import DicebearAvatar from "@workspace/ui/components/dicebear-avatar";
import { Form, FormField } from "@workspace/ui/components/form";
import { InputGroupButton } from "@workspace/ui/components/input-group";
import { Spinner } from "@workspace/ui/components/spinner";
import { cn } from "@workspace/ui/lib/utils";
import { useAction, useMutation, useQuery } from "convex/react";
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod/v4";
import ConversationStatusButton from "../components/conversation-status-button";
import { useState } from "react";
import useInfiniteScroll from "@workspace/ui/hooks/use-infinite-scroll";
import InfiniteScrollTrigger from "@workspace/ui/components/infinite-scroll-trigger";

const ConversationIdView = ({
    conversationId
}: {
    conversationId: Id<"conversations">;
}) => {
    const conversation = useQuery(api.private.conversations.getOne, { conversationId });
    const createMessage = useMutation(api.private.message.create);
    const updataConversationStatus = useMutation(api.private.conversations.updateStatus);

    const [isStatusUpdating, setIsStatusUpdating] = useState(false);

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
        try {
            await createMessage({
                conversationId,
                prompt: values.message
            });

        } catch (error) {
            console.error(error);
        }
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

    const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } = useInfiniteScroll({
        status: messages.status,
        loadMore: messages.loadMore,
        loadSize: 5,
        observerEnabled: false
    });

    const [isEnhancing, setIsEnhancing] = useState(false);
    const enhanceResponse = useAction(api.private.message.enhanceResponse);
    const handleEnhanceResponse = async () => {
        setIsEnhancing(true);

        let currentValue = form.getValues("message");
        try {
            const response = await enhanceResponse({ prompt: currentValue });

            form.setValue("message", response, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
            });

            form.trigger("message")
        } catch (error) {
            console.error(error);
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!conversation) {
            return;
        }

        setIsStatusUpdating(true);

        let newStatus: Doc<"conversations">["status"];

        // cycle conversation stastus: "unresolved" => "escalated" => "resolved" => "unresolved"
        if (conversation.status === "unresolved") {
            newStatus = "escalated";
        } else if (conversation.status === "escalated") {
            newStatus = "resolved";
        } else {
            newStatus = "unresolved";
        }

        try {
            await updataConversationStatus({
                conversationId,
                status: newStatus
            });
        } catch (error) {
            console.log(error);
        } finally {
            setIsStatusUpdating(false);
        }

    };

    return (

        <div className="flex h-full flex-col bg-muted">
            <header className="flex items-center justify-between border-b bg-background p-2.5">
                <Button
                    size={"sm"}
                    variant={"ghost"}
                >
                    <MoreHorizontalIcon />
                </Button>
                {!!conversation && (
                    <ConversationStatusButton
                        onClick={handleToggleStatus}
                        status={conversation.status}
                        disabled={isStatusUpdating}
                    />
                )}
            </header>
            {/* conversation */}
            <Conversation>
                <ConversationContent>
                    <InfiniteScrollTrigger
                        canLoadMore={canLoadMore}
                        isLoadingMore={isLoadingMore}
                        onLoadMore={handleLoadMore}
                        ref={topElementRef}
                    />
                    {toUIMessages(messages.results ?? [])?.filter((message) => {
                        // 过滤掉没有文本内容且不是用户消息的空消息
                        return message.role === "user" || (message.role === "assistant" && message.text);
                    }).map((message) => (
                        <Message
                            from={message.role === "user" ? "assistant" : "user"}
                            key={message.id}
                        >
                            <MessageContent
                                className={cn(
                                    message.role === "user" && "bg-background!"
                                )}
                            >
                                {message.text ? (
                                    <Response>{message.text}</Response>
                                ) : (
                                    <Spinner />
                                )}
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
                                name="message"
                                render={({ field }) => (
                                    <PromptInputTextarea
                                        onChange={field.onChange}
                                        disabled={conversation?.status === "resolved"}
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
                                    <InputGroupButton
                                        disabled={conversation?.status === "resolved" || isEnhancing || !form.formState.isValid}
                                        onClick={handleEnhanceResponse}
                                    >
                                        <Wand2Icon />
                                        {isEnhancing ? "Enhancing..." : "Enhance"}
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