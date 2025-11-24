"use client";

import { contactSessionIdAtomFaily, errorMessageAtom, loadingMessageAtom, organizationIdAtom, screenAtom, widgetSettingsAtom } from "@/modules/widget/atoms/widget-atoms";
import WidgetHeader from "@/modules/widget/ui/components/widget-header";
import { api } from "@workspace/backend/_generated/api";
import { Spinner } from "@workspace/ui/components/spinner";
import { useAction, useMutation, useQuery } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

type InitStep = "storage" | "org" | "session" | "setting" | "vapi" | "done";

const WidgetLoadingScreen = ({ organizationId }: { organizationId: string | null; }) => {
    const [step, setSetp] = useState<InitStep>("org");
    const [sessionValid, setSessionValid] = useState(false);

    const loadingMessage = useAtomValue(loadingMessageAtom);
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const setLoadingMessage = useSetAtom(loadingMessageAtom);
    const setWidgetSettings = useSetAtom(widgetSettingsAtom);
    const setOrganizationId = useSetAtom(organizationIdAtom);
    const setScreen = useSetAtom(screenAtom);

    const contactSessionId = useAtomValue(contactSessionIdAtomFaily(organizationId));

    const validateOrganization = useAction(api.public.organizations.validate);

    // step1: validate organization
    useEffect(() => {
        if (step !== "org") {
            return;
        }

        setLoadingMessage("Finding organization ID...");

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
                    setSetp("session");
                } else {
                    setErrorMessage(result?.reason || "Invalid configuration");
                    setScreen("error");
                }
            })
            .catch(() => {
                setErrorMessage("Unable to varify organization");
                setScreen("error");
            });
    }, [step, organizationId, setErrorMessage, setScreen, setLoadingMessage, validateOrganization, setOrganizationId]); // TODO: 什么是闭包问题，为什么要避免

    // step 2: validate session if exists
    const validateContactSession = useMutation(api.public.contactSessions.validate);
    useEffect(() => {
        if (step !== "session") {
            return;
        }

        setLoadingMessage("Finding contact session ID...");

        if (!contactSessionId) {
            setSessionValid(false);
            setSetp("setting");
            return;
        }

        setLoadingMessage("Validating session...");

        validateContactSession({
            contactSessionId: contactSessionId
        })

            .then((result) => {
                setSessionValid(result.valid);
                setSetp("setting");
            })
            .catch(() => {
                setSessionValid(false);
                setSetp("setting");
            });
    }, [step, contactSessionId, validateContactSession, setLoadingMessage]);

    // Step 3: Load Widget Settings
    const widgetSettings = useQuery(api.public.widgetSettings.getByOrganizationId, 
        organizationId ? {
            organizationId
        } : "skip"
    )

    useEffect(() => {
        if (step !== "setting") {
            return
        }

        setLoadingMessage("Loading widget settings...")

        if (widgetSettings !== undefined && organizationId) {
            setWidgetSettings(widgetSettings)
            setSetp("done")
        }
    }, [
        step,
        widgetSettings,
        setWidgetSettings,
        setLoadingMessage
    ])

    useEffect(() => {
        if (step !== "done") {
            return;
        }

        const hasValidSession = contactSessionId && sessionValid;
        setScreen(hasValidSession ? "selection" : "auth")
    }, [step, contactSessionId, sessionValid, setScreen]);

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