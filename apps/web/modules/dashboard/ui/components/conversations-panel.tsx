"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { ArrowRightIcon, ArrowUpIcon, CheckIcon, ListIcon } from "lucide-react";
import { ScrollArea } from "../../../../../../packages/ui/src/components/scroll-area";

const ConversationsPanel = () => {
    return (
        <div className="flex flex-col h-full w-full bg-background text-sidebar-foreground">
            <div className="flex flex-col gap-3.5 border-b p-2">
                <Select
                    defaultValue="all"
                    onValueChange={() => { }}
                    // value="all"
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
            <ScrollArea>
                <div className="flex w-full flex-1 flex-col text-sm">
                    abc
                </div>
            </ScrollArea>
        </div>
    );
};

export default ConversationsPanel;