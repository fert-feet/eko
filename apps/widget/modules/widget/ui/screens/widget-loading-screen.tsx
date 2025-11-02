"use client";

import WidgetHeader from "@/modules/widget/ui/components/widget-header";
import { Spinner } from "@workspace/ui/components/spinner";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { errorMessageAtom, loadingMessageAtom } from "@/modules/widget/atoms/widget-atoms";

type InitStep = "storage" | "org" | "session" | "setting" | "vapi" | "done"

const WidgetLoadingScreen = ({ organizationId }: { organizationId: string | null; }) => {
    const [step, setSetp] = useState<InitStep>("org")
    const [sessionValid, setSessionValid] = useState(false)

    const loadingMessage = useAtomValue(loadingMessageAtom)
    const setErrorMessage = useSetAtom(errorMessageAtom)
    
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