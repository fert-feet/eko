import React from "react";
import { cn } from "@workspace/ui/lib/utils";

const WigetHeader = ({
    children,
    className
}: {
    children: React.ReactNode,
    className?: string;
}) => {
    return (
        <header className={cn(
            "bg-primary p-4 text-primary-foreground",
            className,
        )}>
            {children}
        </header>
    );
};

export default WigetHeader;