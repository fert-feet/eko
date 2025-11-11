"use client";

import { statusFilterAtom } from "@/modules/dashboard/atoms";
import { api } from "@workspace/backend/_generated/api";
import { Doc } from "@workspace/backend/_generated/dataModel";
import ConversationStatusIcon from "@workspace/ui/components/conversation-status-icon";
import DicebearAvatar from "@workspace/ui/components/dicebear-avatar";
import InfiniteScrollTrigger from "@workspace/ui/components/infinite-scroll-trigger";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import useInfiniteScroll from "@workspace/ui/hooks/use-infinite-scroll";
import { cn } from "@workspace/ui/lib/utils";
import { usePaginatedQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowRightIcon, ArrowUpIcon, CheckIcon, CornerUpLeftIcon, ListIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ConversationsPanel = () => {
    const pathname = usePathname();

    const statusFilter = useAtomValue(statusFilterAtom);

    const setStatusFilter = useSetAtom(statusFilterAtom);

    const conversations = usePaginatedQuery(
        api.private.conversations.getMany,
        {
            status: statusFilter === "all" ? null : statusFilter
        },
        {
            initialNumItems: 10
        }
    );

    const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore, isLoadingFirstPage } = useInfiniteScroll({
        status: conversations.status,
        loadMore: conversations.loadMore,
        loadSize: 5,
        observerEnabled: false
    });

    const onSelect = (value: string) => {
        setStatusFilter(value as Doc<"conversations">["status"] | "all");
    };

    return (
        <div className="flex flex-col h-full w-full bg-background text-sidebar-foreground">
            <div className="flex flex-col gap-3.5 border-b p-2">
                <Select
                    defaultValue="all"
                    value={statusFilter}
                    onValueChange={(value) => onSelect(value)}
                >
                    <SelectTrigger
                        className="h-8 border-none px-1.5 shadow-none ring-0 hover:bg-accent hover:text-accent-foreground focus-visible:ring-0 cursor-pointer"
                    >
                        <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                        <SelectItem value="all">
                            <div className="flex items-center gap-2">
                                <ListIcon className="size-4" />
                                <span>All</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="resolved">
                            <div className="flex items-center gap-2">
                                <CheckIcon className="size-4" />
                                <span>Resolved</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="escalated">
                            <div className="flex items-center gap-2">
                                <ArrowUpIcon className="size-4" />
                                <span>Escalated</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="unresolved">
                            <div className="flex items-center gap-2">
                                <ArrowRightIcon className="size-4" />
                                <span>Unresolved</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {isLoadingFirstPage ? (
                <SkeletonConversations />
            ) : (
                <ScrollArea className="max-h-[calc(100vh-53px)]">
                    <div className="flex w-full flex-1 flex-col text-sm">
                        {conversations.results.map((conversation) => {
                            const isLastMessageFromOperator = conversation.lastMessage?.message?.role !== "user";

                            const badgeUrl = "/eko-logo.svg";

                            return (
                                <Link
                                    key={conversation._id}
                                    href={`/conversations/${conversation._id}`}
                                    className={cn(
                                        "relative group flex cursor-pointer items-start gap-3 border-b p-4 py-5 text-sm leading-tight hover:text-accent-foreground hover:bg-accent",
                                        pathname === `/conversations/${conversation._id}` && "bg-accent text-accent-foreground"
                                    )}
                                >
                                    <div className={cn(
                                        "-translate-y-1/2 group-hover:opacity-100 absolute top-1/2 left-0 h-[64%] w-1 rounded-r-full bg-neutral-300 opacity-0 transition-opacity",
                                        pathname === `/conversations/${conversation._id}` && "opacity-100"
                                    )} />
                                    <DicebearAvatar
                                        seed={conversation.contactSession._id}
                                        size={40}
                                        className="shrink-0"
                                        badgeImageUrl={badgeUrl}
                                    />
                                    <div className="flex-1">
                                        <div className="flex w-full items-center gap-2">
                                            <span className="truncate font-bold">
                                                {conversation.contactSession.name}
                                            </span>
                                            <span className="ml-auto shrink-0 text-muted-foreground text-xs">
                                                {formatDistanceToNow(conversation._creationTime)}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex items-center justify-between gap-2">
                                            <div className="flex w-0 grow items-center gap-1">
                                                {isLastMessageFromOperator && (
                                                    <CornerUpLeftIcon className="size-3 shrink-0 text-muted-foreground" />
                                                )}
                                                <span
                                                    className={cn(
                                                        "line-clamp-1 text-muted-foreground text-xs",
                                                        !isLastMessageFromOperator && "font-bold text-black"
                                                    )}
                                                >
                                                    {conversation.lastMessage?.text}
                                                </span>
                                            </div>
                                            <ConversationStatusIcon status={conversation.status} />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                        <InfiniteScrollTrigger
                            canLoadMore={canLoadMore}
                            isLoadingMore={isLoadingMore}
                            onLoadMore={handleLoadMore}
                            ref={topElementRef}
                        />
                    </div>
                </ScrollArea>
            )}
        </div>
    );
};

export default ConversationsPanel;

export const SkeletonConversations = () => {
    return (
        <div className="flex flex-col h-full w-full bg-background text-sidebar-foreground">
            <ScrollArea className="max-h-[calc(100vh-53px)]">
                <div className="flex w-full flex-1 flex-col text-sm">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="relative group flex items-start gap-3 border-b p-4 py-5 text-sm leading-tight">
                            <div className="w-10 h-10 rounded-full bg-muted animate-pulse shrink-0" />
                            <div className="flex-1">
                                <div className="flex w-full items-center gap-2">
                                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                                    <div className="ml-auto h-3 w-12 bg-muted rounded animate-pulse shrink-0" />
                                </div>
                                <div className="mt-1 flex items-center justify-between gap-2">
                                    <div className="flex w-0 grow items-center gap-1">
                                        <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                                    </div>
                                    <div className="w-4 h-4 bg-muted rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}