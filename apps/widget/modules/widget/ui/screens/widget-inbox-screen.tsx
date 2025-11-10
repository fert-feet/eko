"use client";

import WidgetHeader from "@/modules/widget/ui/components/widget-header";

const WidgetInboxScreen = () => {
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
            <div className="flex flex-1 flex-col gap-y-4 p-4">
                <p className="text-sm">
                    inbox
                </p>
            </div>
        </>
    );
};

export default WidgetInboxScreen;