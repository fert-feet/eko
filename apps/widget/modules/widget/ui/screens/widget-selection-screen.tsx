"use client";

import { contactSessionIdAtomFaily, conversationIdAtom, errorMessageAtom, hasVapiSecretsAtom, organizationIdAtom, screenAtom, widgetSettingsAtom } from "@/modules/widget/atoms/widget-atoms";
import WidgetFooter from "@/modules/widget/ui/components/widget-footer";
import WidgetHeader from "@/modules/widget/ui/components/widget-header";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { useMutation } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import { ChevronRightIcon, MessageSquareTextIcon, MicIcon, PhoneIcon } from "lucide-react";
import { useState } from "react";

const WidgetSelectionScreen = () => {
    const setScreen = useSetAtom(screenAtom);
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const setConversationId = useSetAtom(conversationIdAtom);

    const organizationId = useAtomValue(organizationIdAtom);
    const widgetSettings = useAtomValue(widgetSettingsAtom);
    const hasVapiSecrets = useAtomValue(hasVapiSecretsAtom);
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

            setConversationId(conversationId);
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
                {hasVapiSecrets && widgetSettings?.vapiSettings.assistantId && (
                    <Button
                        className="justify-between h-16 w-full"
                        variant={"outline"}
                        onClick={() => setScreen("voice")}
                        disabled={isPending}
                    >
                        <div className="flex items-center gap-x-2">
                            <MicIcon className="size-4" />
                            <span>Start voice call</span>
                        </div>
                        <ChevronRightIcon />
                    </Button>
                )}
                {hasVapiSecrets && widgetSettings?.vapiSettings.phoneNumber && (
                    <Button
                        className="justify-between h-16 w-full"
                        variant={"outline"}
                        onClick={() => setScreen("contact")}
                        disabled={isPending}
                    >
                        <div className="flex items-center gap-x-2">
                            <PhoneIcon className="size-4" />
                            <span>Call us</span>
                        </div>
                        <ChevronRightIcon />
                    </Button>
                )}
            </div>
            <WidgetFooter />
        </>
    );
};

export default WidgetSelectionScreen;