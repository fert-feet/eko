"use client";

import WidgetHeader from "@/modules/widget/ui/components/widget-header";
import { ChevronRightIcon, MessageSquareTextIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { contactSessionIdAtomFaily, conversationIdAtom, errorMessageAtom, organizationIdAtom, screenAtom } from "@/modules/widget/atoms/widget-atoms";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState } from "react";

const WidgetSelectionScreen = () => {
    const setScreen = useSetAtom(screenAtom);
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const setConversationId = useSetAtom(conversationIdAtom)

    const organizationId = useAtomValue(organizationIdAtom);
    const contactSessionId = useAtomValue(
        contactSessionIdAtomFaily(organizationId)
    );

    const createConversation = useMutation(api.public.conversations.create);

    const [isPending, setIsPending] = useState(false);

    const handleNewConversation = async () => {
        if (!organizationId) {
            setScreen("error");
            setErrorMessage("Missing organization");
            return;
        }

        if (!contactSessionId) {
            setScreen("auth");
            return;
        }

        setIsPending(true);
        try {
            const conversationId = await createConversation({
                organizationId,
                contactSessionId
            });

            setConversationId(conversationId)
            setScreen("chat");
        } catch {
            setScreen("auth");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <WidgetHeader>
                <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
                    <p className="text-3xl">
                        Hi there! 👋
                    </p>
                    <p className="text-lg">
                        Let&apos;s get you started
                    </p>
                </div>
            </WidgetHeader>
            <div className="flex flex-col flex-1 gap-y-4 p-4 overflow-y-auto">
                <Button
                    className="justify-between h-16 w-full"
                    variant={"outline"}
                    onClick={handleNewConversation}
                    disabled={isPending}
                >
                    <div className="flex items-center gap-x-2">
                        <MessageSquareTextIcon className="size-4" />
                        <span>Start chat</span>
                    </div>
                    <ChevronRightIcon />
                </Button>

            </div>
        </>
    );
};

export default WidgetSelectionScreen;