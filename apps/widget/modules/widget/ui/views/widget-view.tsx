"use client";

import WidgetAuthScreen from "@/modules/widget/ui/screens/widget-auth-screen";

// import WigetFooter from "../components/widget-footer";
// import WigetHeader from "../components/widget-header";

interface Props {
    organizationId: string;
}

const WidgetView = ({ organizationId }: Props) => {
    return (
        <>
            <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
                    <WidgetAuthScreen />
                {/* <WigetFooter /> */}
            </main>
        </>
    );
};

export default WidgetView;