"use client";

import { contactSessionIdAtomFaily, conversationIdAtom, organizationIdAtom, screenAtom } from "@/modules/widget/atoms/widget-atoms";
import WidgetHeader from "@/modules/widget/ui/components/widget-header";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@workspace/backend/_generated/api";
import { Conversation, ConversationContent } from "@workspace/ui/components/ai/conversation";
import { Message, MessageContent } from "@workspace/ui/components/ai/message";
import { PromptInput, PromptInputFooter, PromptInputProvider, PromptInputSubmit, PromptInputTextarea, PromptInputTools } from "@workspace/ui/components/ai/prompt-input";
import { Response } from "@workspace/ui/components/ai/response";
import { Button } from "@workspace/ui/components/button";
import { useAction, useQuery } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import InfiniteScrollTrigger from "@workspace/ui/components/infinite-scroll-trigger";
import useInfiniteScroll from "@workspace/ui/hooks/use-infinite-scroll";
import DicebearAvatar from "@workspace/ui/components/dicebear-avatar";

import { Form, FormField } from "@workspace/ui/components/form";
import z from "zod";
import { Spinner } from "@workspace/ui/components/spinner";
import { cn } from "@workspace/ui/lib/utils";

const formSchema = z.object({
    message: z.string().min(1, "Message is Required")
});
const WidgetChatScreen = () => {
    const setScreen = useSetAtom(screenAtom);
    const setConversationId = useSetAtom(conversationIdAtom);

    const conversationId = useAtomValue(conversationIdAtom);
    const organizationId = useAtomValue(organizationIdAtom);

    const contactSessionId = useAtomValue(contactSessionIdAtomFaily(organizationId));

    const conversation = useQuery(api.public.conversations.getOne,
        conversationId && contactSessionId ?
            ({
                conversationId,
                contactSessionId
            }) :
            (
                "skip"
            )
    );

    const messages = useThreadMessages(
        api.public.message.getMany,
        conversation?.threadId && contactSessionId ?
            {
                threadId: conversation.threadId,
                contactSessionId: contactSessionId
            } :
            "skip",
        {
            initialNumItems: 5
        }
    );

    const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } = useInfiniteScroll({
        status: messages.status,
        loadMore: messages.loadMore,
        loadSize: 5,
        observerEnabled: false
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: ""
        }
    });

    const createMessage = useAction(api.public.message.create);
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!conversation || !contactSessionId) {
            return;
        }

        form.reset();

        await createMessage({
            threadId: conversation.threadId,
            contactSessionId,
            prompt: values.message
        });
    };


    const onBack = () => {
        setConversationId(null);
        setScreen("selection");
    };


    return (
        <>
            <WidgetHeader className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <Button
                        size={"icon"}
                        variant={"transparent"}
                        onClick={onBack}
                    >
                        <ArrowLeftIcon />
                    </Button>
                    <p>Chat</p>
                </div>
                <Button
                    size="icon"
                    variant={"transparent"}
                >
                    <MenuIcon />
                </Button>
            </WidgetHeader>
            <Conversation className="max-h-[calc(100vh-180px)]">
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
                    }).map((message) => {
                        return (
                            <Message
                                from={message.role === "user" ? "user" : "assistant"}
                                key={message.id}
                            >
                                <MessageContent
                                    className={cn(
                                        message.role !== "user" && "bg-background!"
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
                                        seed="user"
                                    />
                                )}
                                {message.role === "assistant" && (
                                    <DicebearAvatar
                                        seed="assistant"
                                        badgeImageUrl="/eko-logo.svg"
                                    />
                                )}
                            </Message>
                        );
                    })}
                </ConversationContent>
            </Conversation>
            {/* TODO: Add suggestions */}
            <Form {...form}>
                    <PromptInput
                        className="rounded-none border-x-0 border-b-0"
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
                                    disabled={conversation?.status === "resolved" || !form.formState.isValid}
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
                            <PromptInputTools />
                            <PromptInputSubmit
                                disabled={conversation?.status === "resolved" || !form.formState.isValid}
                                status="ready"
                                type="submit"
                            />
                        </PromptInputFooter>
                    </PromptInput>
            </Form>
        </>
    );
};

export default WidgetChatScreen;