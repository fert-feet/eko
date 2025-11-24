"use client";

import { useParams } from "next/navigation";
import Bowser from "bowser";
import DicebearAvatar from "@workspace/ui/components/dicebear-avatar";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "../../../../../../packages/ui/src/components/button";
import Link from "next/link";
import { MailIcon } from "lucide-react";
import { useMemo } from "react";
import { userAgent } from "next/server";

const ContactPanel = () => {
    const params = useParams();
    const conversationId = params.conversationId as (Id<"conversations"> | null);

    const contactSession = useQuery(api.private.contactSessions.getOne,
        conversationId ? {
            conversationId
        } : "skip"
    );

    const parseUserAgent = useMemo(() => {
        return (userAgent?: string) => {
            if (!userAgent) {
                return { browser: "Unknown", os: "Unknown", device: "Unknown" };
            }

            const browser = Bowser.getParser(userAgent);
            const result = browser.getResult();

            return {
                browser: result.browser.name || "Unknown",
                browserVersion: result.browser.version || "",
                os: result.os.name || "Unknown",
                osVersion: result.os.version || "",
                device: result.platform.type || "desktop",
                deviceVendor: result.platform.vendor || "",
                deviceModel: result.platform.model || "",
            };
        };
    }, []);

    const userAgentInfo = useMemo(() =>
        parseUserAgent(contactSession?.metadata?.userAgent),
        [contactSession?.metadata?.userAgent, parseUserAgent]);

    if (contactSession === undefined || contactSession === null) {
        return null;
    }

    return (
        <div className="flex h-full w-full flex-col bg-background text-foreground">
            <div className="flex flex-col gap-y-4 p-4">
                <div className="flex items-center gap-x-2">
                    <DicebearAvatar
                        badgeImageUrl="/eko-logo.svg"
                        seed={contactSession._id}
                        size={42}
                    />
                    <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-x-2">
                            <h4 className="line-clamp-1">
                                {contactSession.name}
                            </h4>
                        </div>
                        <p className="line-clamp-1 text-muted-foreground text-sm">
                            {contactSession.email}
                        </p>
                    </div>
                </div>
                <Button asChild className="w-full" size={"lg"}>
                    <Link href={`mailto:${contactSession.email}`}>
                        <MailIcon />
                        <span>Send Email</span>
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default ContactPanel;