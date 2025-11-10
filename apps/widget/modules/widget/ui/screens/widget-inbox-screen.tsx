"use client";

import { contactSessionIdAtomFaily, conversationIdAtom, organizationIdAtom, screenAtom } from "@/modules/widget/atoms/widget-atoms";
import WidgetFooter from "@/modules/widget/ui/components/widget-footer";
import WidgetHeader from "@/modules/widget/ui/components/widget-header";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import ConversationStatusIcon from "@workspace/ui/components/conversation-status-icon";
import InfiniteScrollTrigger from "@workspace/ui/components/infinite-scroll-trigger";
import useInfiniteScroll from "@workspace/ui/hooks/use-infinite-scroll";
import { usePaginatedQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";

const WidgetInboxScreen = () => {
    const setScreen = useSetAtom(screenAtom);
    const setConversationId = useSetAtom(conversationIdAtom);

    const conversationId = useAtomValue(conversationIdAtom);
    const organizationId = useAtomValue(organizationIdAtom);

    const contactSessionId = useAtomValue(contactSessionIdAtomFaily(organizationId));

    const conversations = usePaginatedQuery(api.public.conversations.getMany,
        contactSessionId ? { contactSessionId } : "skip",
        {
            initialNumItems: 5
        }
    );

    const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } = useInfiniteScroll({
        status: conversations.status,
        loadMore: conversations.loadMore,
        loadSize: 5,
        observerEnabled: false
    });

    const onBack = () => {
        setScreen("selection");
    };

    const onClickConversation = (conversationId: Id<"conversations">) => {
        setConversationId(conversationId);
        setScreen("chat");
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
                    <p>inbox</p>
                </div>
                <Button
                    size="icon"
                    variant={"transparent"}
                >
                    <MenuIcon />
                </Button>
            </WidgetHeader>
            <div className="flex flex-1 flex-col gap-y-2 p-4 overflow-y-auto">
                {conversations.results.map((conversation) => (
                    <Button
                        className="h-20 w-full justify-between"
                        key={conversation._id}
                        variant={"outline"}
                        onClick={() => onClickConversation(conversation._id)}
                    >
                        <div className="flex flex-col w-full overflow-hidden text-start gap-4">
                            <div className="text-xs text-muted-foreground items-center justify-between flex w-full">
                                <p>Chat</p>
                                <p>{formatDistanceToNow(new Date(conversation._createTime))}</p>
                            </div>
                            <div className="flex w-full justify-between gap-x-2">
                                <p className="truncate text-sm">
                                    {conversation.lastMessage?.text}
                                </p>
                                <ConversationStatusIcon status={conversation.status} />
                            </div>
                        </div>
                    </Button>
                ))}
                <InfiniteScrollTrigger
                    canLoadMore={canLoadMore}
                    isLoadingMore={isLoadingMore}
                    onLoadMore={handleLoadMore}
                    ref={topElementRef}
                />
            </div>
            <WidgetFooter />
        </>
    );
};

export default WidgetInboxScreen;