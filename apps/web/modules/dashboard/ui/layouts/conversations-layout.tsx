import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@workspace/ui/components/resizable";
import React from "react";
import ConversationsPanel from "../components/conversations-panel";

const ConversationsLayout = ({
    children
}: {children: React.ReactNode}) => {
    return ( 
        <ResizablePanelGroup direction="horizontal" className="h-full flex-1">
            <ResizablePanel defaultSize={30} maxSize={30} minSize={20}>
                <ConversationsPanel />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={70} className="h-full">
                {children}
            </ResizablePanel>
        </ResizablePanelGroup>
     );
}
 
export default ConversationsLayout;