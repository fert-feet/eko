"use client";

import WigetFooter from "../components/widget-footer";

interface Props {
    organizationId: string;
}

const WidgetView = ({ organizationId }: Props) => {
    return (
        <>
            <main className="flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
                Wiget View: {organizationId}
            </main>
            <WigetFooter />
        </>
    );
};

export default WidgetView;