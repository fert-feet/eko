"use client";

import { useOrganization } from "@clerk/nextjs";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "../../../../../../packages/ui/src/components/button";
import { useState } from "react";
import { toast } from "sonner";

const IntegrationsView = () => {
    const { organization } = useOrganization();

    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!organization) {
            return;
        }

        try {
            await navigator.clipboard.writeText(organization.id);
            setCopied(true);
            toast.success("Copied organization id")
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-muted p-8">
            <div className="mx-auto w-full max-w-3xl">
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-4xl">Setup & Integration</h1>
                    <p className="text-muted-foreground">
                        Choose the integration that&apos;s right for you
                    </p>
                </div>
                <div className="mt-8 space-y-6">
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
                        <Button onClick={handleCopy} size={"sm"}>
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
            </div>
        </div>
    );
};

export default IntegrationsView;