"use client";

import { screenAtom } from "@/modules/widget/atoms/widget-atoms";
import WidgetFooter from "@/modules/widget/ui/components/widget-footer";
import WidgetHeader from "@/modules/widget/ui/components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { useSetAtom } from "jotai";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";

const WidgetInboxScreen = () => {
    const setScreen = useSetAtom(screenAtom)

    const onBack = () => {
        setScreen("selection") 
    }

    return (
        <>
            <WidgetHeader className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <Button
                        size={"icon"}
                        variant={"transparent"}
                        onClick={onBack}
                    >
                        <ArrowLeftIcon />
                    </Button>
                    <p>inbox</p>
                </div>
                <Button
                    size="icon"
                    variant={"transparent"}
                >
                    <MenuIcon />
                </Button>
            </WidgetHeader>
            <div className="flex flex-1 flex-col gap-y-4 p-4">
                <p className="text-sm">
                    inbox
                </p>
            </div>
            <WidgetFooter />
        </>
    );
};

export default WidgetInboxScreen;