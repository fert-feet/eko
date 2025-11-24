import React from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@workspace/ui/components/resizable";

const ConversationIdLayout = ({
    children
}: {children: React.ReactNode}) => {
    return ( 
        <ResizablePanelGroup className="h-full flex-1" direction="horizontal">
            <ResizablePanel className="h-full" defaultSize={60}>
                <div className="flex h-full flex-1 flex-col">{children}</div>
            </ResizablePanel>
            <ResizableHandle className="hidden lg:block" />
            <ResizablePanel
            defaultSize={40}
            maxSize={40}
            minSize={20}
            >
                <div>Contact Panel</div>
            </ResizablePanel>
        </ResizablePanelGroup>
     );
}
 
export default ConversationIdLayout;