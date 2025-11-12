"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip";

interface HintProps {
    children: React.ReactNode;
    text: string;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
}

const Hint = ({
    children,
    text,
    side = "top",
    align = "center"
}: HintProps) => {
    return (
        <Tooltip>
            <TooltipTrigger>{children}</TooltipTrigger>
            <TooltipContent>
                <p>{text}</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default Hint;