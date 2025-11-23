"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { BotIcon } from "lucide-react";
import { useVapiAssistants } from "../hooks/use-vapi-data";

const VapiAssistantsTab = () => {
    const { data: assistants, isLoading } = useVapiAssistants();

    return (
        <div className="boder-t bg-background">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="px-6 py-4">
                            Assistants
                        </TableHead>
                        <TableHead className="px-6 py-4">
                            Model
                        </TableHead>
                        <TableHead className="px-6 py-4">
                            First Message
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>

                    {(() => {
                        if (isLoading) {
                            return (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="px-6 py-8 text-center text-muted-foreground"
                                    >
                                        Loading assistants
                                    </TableCell>
                                </TableRow>
                            );
                        }

                        if (assistants.length === 0) {
                            return (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="px-6 py-8 text-center text-muted-foreground"
                                    >
                                        No assistants configured
                                    </TableCell>
                                </TableRow>
                            );
                        }

                        return assistants.map((assistant) => (
                            <TableRow className="hover:bg-muted/50" key={assistant.id}>
                                <TableCell className="px-6 py-4" >
                                    <div className="flex items-center gap-3">
                                        <BotIcon className="size-4 text-muted-foreground" />
                                        <span className="font-mono">
                                            {assistant.name || "Unnamed Assistants"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <span className="text-sm">
                                        {assistant.model?.model || "Not configured"}
                                    </span>
                                </TableCell>
                                <TableCell className="px-6 py-4 max-w-xs">
                                    <p className="truncate text-muted-foreground text-sm">
                                        {assistant.firstMessage || "No greeting configured"}
                                    </p>
                                </TableCell>
                            </TableRow>
                        ));
                    })()}
                </TableBody>
            </Table>
        </div>
    );
};

export default VapiAssistantsTab;