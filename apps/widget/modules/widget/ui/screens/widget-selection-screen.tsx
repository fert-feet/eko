"use client";

import WidgetHeader from "@/modules/widget/ui/components/widget-header";
import { ChevronRightIcon, MessageSquareTextIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

const WidgetSelectionScreen = () => {
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
                onClick={() => {}}
                >
                    <div className="flex items-center gap-x-2">
                        <MessageSquareTextIcon className="size-4" />
                        <span>Start chat</span>
                    </div>
                    <ChevronRightIcon />
                </Button>

            </div>
        </>
    );
};

export default WidgetSelectionScreen;