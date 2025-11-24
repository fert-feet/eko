import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftIcon, MenuIcon, MicIcon, MicOffIcon } from "lucide-react";
import { screenAtom } from "../../atoms/widget-atoms";
import WidgetHeader from "../components/widget-header";
import WidgetFooter from "../components/widget-footer";
import { useVapi } from "../../hooks/use-vapi";
import { cn } from "@workspace/ui/lib/utils";

const WidgetVoiceScreen = () => {
    const setScreen = useSetAtom(screenAtom);
    const {
        isSpeaking,
        isConnecting,
        isConnected,
        transcript,
        startCall,
        endCall,
    } = useVapi();

    return (
        <>
            <WidgetHeader className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <Button
                        size={"icon"}
                        variant={"transparent"}
                        onClick={() => setScreen("selection")}
                    >
                        <ArrowLeftIcon />
                    </Button>
                    <p>Voice call</p>
                </div>
            </WidgetHeader>
            {JSON.stringify(transcript, null, 2)}
            <div className="flex flex-1 h-full flex-col items-center justify-center gap-y-4">
                <div className="flex items-center justify-center rounded-full border bg-white p-3">
                    <MicIcon className="size-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Transcript will appear here</p>
            </div>
            <div className="border-t bg-background p-4">
                <div className="flex flex-col items-center gap-y-4">
                    {isConnected && (
                        <div className="flex items-center gap-x-2">
                            <div className={cn("size-4 rounded-full",
                                isSpeaking ? " animate-pulse bg-red-500" : "bg-green-500"
                            )} />
                            <span className="text-muted-foreground text-sm">
                                {isSpeaking ? "Assistants Speaking" : "Listening..."}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-center w-full">
                        {isConnected ? (
                            <Button
                                className="w-full"
                                size={"lg"}
                                disabled={isConnecting}
                                variant={"destructive"}
                                onClick={() => endCall()}
                            >
                                <MicOffIcon />
                                End call
                            </Button>
                        ) : (
                            <Button
                                className="w-full"
                                size={"lg"}
                                disabled={isConnecting}
                                onClick={() => startCall()}
                            >
                                <MicIcon />
                                Start call
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default WidgetVoiceScreen;