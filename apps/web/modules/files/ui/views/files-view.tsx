"use client";

import { api } from "@workspace/backend/_generated/api";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu";
import InfiniteScrollTrigger from "@workspace/ui/components/infinite-scroll-trigger";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import useInfiniteScroll from "@workspace/ui/hooks/use-infinite-scroll";
import { usePaginatedQuery } from "convex/react";
import { FileIcon, MoreHorizontalIcon, PlusIcon, TrashIcon } from "lucide-react";

const FilesView = () => {
    const files = usePaginatedQuery(
        api.private.files.list,
        {},
        {
            initialNumItems: 10
        }
    );

    const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore, isLoadingFirstPage } = useInfiniteScroll({
        status: files.status,
        loadMore: files.loadMore,
        loadSize: 5,
        observerEnabled: false
    });

    const testData = [
        {
            id: "1",
            name: "test",
            type: "txt",
            size: "1 B"
        }
    ];

    return (
        <div className="flex min-h-screen flex-col bg-muted p-8">
            <div className="mx-auto w-full max-w-3xl">
                {/* 尝试 "gap-y-2" */}
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-4xl">
                        Knowledge Base
                    </h1>
                    <p className="text-muted-foreground">
                        Upload and manage documents for your AI assistans
                    </p>
                </div>
                <div className="mt-8 rounded-lg border bg-background">
                    <div className="flex items-center justify-end border-b px-6 py-4">
                        <Button
                            onClick={() => { }}
                        >
                            <PlusIcon />
                            Add New
                        </Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-6 py-4 font-medium">Name</TableHead>
                                <TableHead className="px-6 py-4 font-medium">Type</TableHead>
                                <TableHead className="px-6 py-4 font-medium">Size</TableHead>
                                <TableHead className="px-6 py-4 font-medium">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(() => {
                                if (isLoadingFirstPage) {
                                    return (
                                        <TableRow>
                                            <TableCell className="h-24 text-center" colSpan={4}>
                                                Loading files...
                                            </TableCell>
                                        </TableRow>
                                    );
                                }

                                // if (files.results.length === 0) {
                                //     return (
                                //         <TableRow>
                                //             <TableCell className="h-24 text-center" colSpan={4}>
                                //                 No files found
                                //             </TableCell>
                                //         </TableRow>
                                //     )
                                // }

                                // TODO: Change to real files data instead of "testData"
                                return testData.map((file) => (
                                    <TableRow className="hover:bg-muted/50" key={file.id}>
                                        <TableCell className="px-6 py-4 font-medium">
                                            <div className="flex items-center gap-3">
                                                <FileIcon />
                                                {file.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 font-medium">
                                            <Badge className="uppercase" variant={"outline"}>
                                                {file.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 font-medium text-muted-foreground">
                                            {file.size}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 font-medium">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        className="size-8 p-0"
                                                        size="sm"
                                                        variant={"ghost"}
                                                    >
                                                        <MoreHorizontalIcon />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => { }}
                                                    >
                                                        <TrashIcon className="size-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ));

                            })()}
                        </TableBody>
                    </Table>
                    {!isLoadingFirstPage && files.results.length > 0 && (
                        <InfiniteScrollTrigger
                            canLoadMore={canLoadMore}
                            isLoadingMore={isLoadingMore}
                            onLoadMore={handleLoadMore}
                            ref={topElementRef}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilesView;
