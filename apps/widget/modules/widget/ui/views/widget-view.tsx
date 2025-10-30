"use client";

import WigetFooter from "../components/widget-footer";
import WigetHeader from "../components/widget-header";

interface Props {
    organizationId: string;
}

const WidgetView = ({ organizationId }: Props) => {
    return (
        <>
            <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
                <WigetHeader>
                    
                    <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
                        <p className="text-3xl">
                            Hi there! 👋
                        </p>
                        <p className="text-lg">
                            How can we help you today?
                        </p>
                    </div>
                </WigetHeader>
                <div className="flex flex-1">
                    Wiget View: {organizationId}
                </div>
                <WigetFooter />
            </main>
        </>
    );
};

export default WidgetView;