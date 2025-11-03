"use client";

import WidgetAuthScreen from "@/modules/widget/ui/screens/widget-auth-screen";
import { useAtomValue } from "jotai";
import { screenAtom } from "@/modules/widget/atoms/widget-atoms";
import WidgetErrorScreen from "@/modules/widget/ui/screens/widget-error-screen";
import WidgetLoadingScreen from "@/modules/widget/ui/screens/widget-loading-screen";

interface Props {
    organizationId: string | null;
}

const WidgetView = ({ organizationId }: Props) => {
    const screen = useAtomValue(screenAtom);

    const screenComponents = {
        error: <WidgetErrorScreen />,
        loading: <WidgetLoadingScreen organizationId={organizationId}/>,
        auth: <WidgetAuthScreen />,
        voice: <p>TODO: Voice</p>,
        inbox: <p>TODO: Inbox</p>,
        selection: <p>TODO: Selection</p>,
        chat: <p>TODO: Chat</p>,
        contact: <p>TODO: Contact</p>,
    };

    return (
        <>
            <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
                {screenComponents[screen]}
            </main>
        </>
    );
};

export default WidgetView;