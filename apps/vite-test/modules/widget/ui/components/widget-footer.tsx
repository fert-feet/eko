import { screenAtom } from "@/modules/widget/atoms/widget-atoms";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { useAtomValue, useSetAtom } from "jotai";
import { HomeIcon, InboxIcon } from "lucide-react";

const WidgetFooter = () => {
    const screen = useAtomValue(screenAtom)
    
    const setScreen = useSetAtom(screenAtom)

    return (
        <footer className="flex items-center justify-between border-t bg-background">
            <Button
                className="h-14 flex-1 rounded-none"
                onClick={() => {setScreen("selection")}}
                size={"icon"}
                variant={"ghost"}
            >
                <HomeIcon
                    className={cn("size-5", screen === "selection" && "text-primary", screen === "inbox" && "text-muted-foreground")}
                />
            </Button>
            <Button
                className="h-14 flex-1 rounded-none"
                onClick={() => {setScreen("inbox")}}
                size={"icon"}
                variant={"ghost"}
            >
                <InboxIcon
                    className={cn("size-5", screen === "selection" && "text-muted-foreground", screen === "inbox" && "text-primary")}
                />
            </Button>
        </footer>
    );
};

export default WidgetFooter;