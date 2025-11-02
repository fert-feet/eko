"use client";

import WidgetAuthScreen from "@/modules/widget/ui/screens/widget-auth-screen";
import { useAtomValue } from "jotai";
import { screenAtom } from "@/modules/widget/atoms/widget-atoms";

interface Props {
    organizationId: string;
}

const WidgetView = ({ organizationId }: Props) => {
    const screen = useAtomValue(screenAtom);

    const screenComponents = {
        error: <p>TODO: Error</p>,
        loading: <p>TODO: Loading</p>,
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