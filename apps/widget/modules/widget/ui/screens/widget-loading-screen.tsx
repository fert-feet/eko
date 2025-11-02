"use client";

import { errorMessageAtom, loadingMessageAtom, organizationIdAtom, screenAtom } from "@/modules/widget/atoms/widget-atoms";
import WidgetHeader from "@/modules/widget/ui/components/widget-header";
import { api } from "@workspace/backend/_generated/api";
import { Spinner } from "@workspace/ui/components/spinner";
import { useAction } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

type InitStep = "storage" | "org" | "session" | "setting" | "vapi" | "done";

const WidgetLoadingScreen = ({ organizationId }: { organizationId: string | null; }) => {
    const [step, setSetp] = useState<InitStep>("org");
    const [sessionValid, setSessionValid] = useState(false);

    const loadingMessage = useAtomValue(loadingMessageAtom);
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const setLoadingMessage = useSetAtom(loadingMessageAtom);
    const setOrganizationId = useSetAtom(organizationIdAtom);
    const setScreen = useSetAtom(screenAtom);

    const validateOrganization = useAction(api.public.organizations.validate);
    useEffect(() => {
        if (step !== "org") {
            return;
        }

        setLoadingMessage("Loading organization...");

        if (!organizationId) {
            setErrorMessage("Organization ID is required");
            setScreen("error");
            return;
        }

        setLoadingMessage("Verifying organization...");

        validateOrganization({ organizationId })
            .then((result) => {
                if (result?.valid) {
                    setOrganizationId(organizationId);
                } else {
                    setErrorMessage(result?.reason || "Invalid configuration");
                    setScreen("error");
                }
            })
            .catch(() => {
                setErrorMessage("Unable to varify organization");
                setScreen("error");
            });
    }, [step, organizationId, setErrorMessage, setScreen]);

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
            <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
                <Spinner className="size-5" />
                <p className="text-sm">
                    {loadingMessage || "Loading..."}
                </p>
            </div>
        </>
    );
};

export default WidgetLoadingScreen;