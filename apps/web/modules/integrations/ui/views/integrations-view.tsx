"use client";

import { useOrganization } from "@clerk/nextjs";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "../../../../../../packages/ui/src/components/button";
import { useState } from "react";
import { toast } from "sonner";
import { Separator } from "@workspace/ui/components/separator";
import { INTEGRATIONS } from "../../constants";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../../../../packages/ui/src/components/dialog";
import { IntegrationId } from "../../types";
import { createScript } from "../../utils";

const IntegrationsView = () => {
    const { organization } = useOrganization();

    const [copied, setCopied] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedSnippet, setSelectedSnippet] = useState("");

    const handleIntegrationClick = (integrationId: IntegrationId) => {
        if (!organization) {
            toast.error("Organization ID not found");
            return;
        }

        const snippet = createScript(integrationId, organization.id);
        setSelectedSnippet(snippet);
        setDialogOpen(true);
    };

    const handleCopy = async () => {
        if (!organization) {
            return;
        }

        try {
            await navigator.clipboard.writeText(organization.id);
            setCopied(true);
            toast.success("Copied organization id");
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <>
            <IntegrationsDialog open={dialogOpen} onOpenChange={setDialogOpen} snippet={selectedSnippet}/>
            <div className="flex min-h-screen flex-col bg-muted p-8">
                <div className="mx-auto w-full max-w-3xl">
                    <div className="space-y-2">
                        <h1 className="text-2xl md:text-4xl">Setup & Integration</h1>
                        <p className="text-muted-foreground">
                            Choose the integration that&apos;s right for you
                        </p>
                    </div>
                    <div className="mt-8">
                        <div className="flex items-center gap-4">
                            <Label className="w-30" htmlFor="organization-id">
                                Organization ID
                            </Label>
                            <Input
                                disabled
                                id="organization-id"
                                value={organization?.id || ""}
                                readOnly
                                className="flex-1 bg-background font-mono text-sm"
                            />
                            <Button
                                onClick={handleCopy}
                                size={"sm"}
                                className="gap-2"
                                disabled={copied}
                            >
                                {copied ? (
                                    <>
                                        <CheckIcon className="mr-2 size-4" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <CopyIcon className="mr-2 size-4" />
                                        Copy
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                    <Separator className="my-8" />
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <Label className="text-lg">Integrations</Label>
                            <p className="text-muted-foreground text-sm">
                                Add the following code to your website to enable the chatbox
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {INTEGRATIONS.map((integration) => (
                                <button
                                    className="cursor-pointer flex items-center gap-4 rounded-lg border bg-background p-4 hover:bg-accent"
                                    type="button"
                                    onClick={() => handleIntegrationClick(integration.id)}
                                    key={integration.id}>
                                    <Image
                                        alt={integration.title}
                                        height={40}
                                        width={40}
                                        src={integration.icon}
                                    />
                                    <p>{integration.title}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

const IntegrationsDialog = ({
    open,
    onOpenChange,
    snippet
}: {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    snippet: string;
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(snippet);
            setCopied(true);
            toast.success("Copied snippet");
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => setCopied(false), 2000);
        }
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Integrate with your website
                    </DialogTitle>
                    <DialogDescription>
                        Follow these steps to add the chatbox to your website
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="rounded-md bg-accent p-2 text-sm">
                            1. Copy the following code
                        </div>
                        <div className="group relative">
                            {/* "pre" 标签保存文字的原本格式 */}
                            <pre className="max-h-[300px] overflow-x-auto overflow-y-auto whitespace-pre-wrap break-all rounded-md bg-foreground p-2 font-mono text-secondary text-sm">
                                {snippet}
                            </pre>
                            <Button
                                onClick={handleCopy}
                                size={"sm"}
                                className="absolute bottom-1 right-1 opacity-0 transition-opacity group-hover:opacity-100"
                                variant={"secondary"}
                                disabled={copied}
                            >
                                {copied ? (
                                    <>
                                        <CheckIcon className="size-3" />
                                    </>
                                ) : (
                                    <>
                                        <CopyIcon className="size-3" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>


                    <div className="space-y-2">
                        <div className="rounded-md bg-accent p-2 text-sm">
                            2. Add the code in your page
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Paste the chatbox code above in your page. You can add it in the HTML head section.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default IntegrationsView;