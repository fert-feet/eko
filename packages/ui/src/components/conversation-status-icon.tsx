import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface ConversationStatusIconProps {
    status: "unresolved" | "escalated" | "resolved"
}

const statusConfig = {
    resolved: {
        icon: CheckIcon,
        bgColor: "text-[#3FB62F]"
    },

    escalated: {
        icon: ArrowUpIcon,
        bgColor: "text-[#be8b00]"
    },

    unresolved: {
        icon: ArrowRightIcon,
        bgColor: "text-[#AD0A1D]"
    }
}

const ConversationStatusIcon = ({
    status
}: ConversationStatusIconProps) => {
    const config = statusConfig[status]
    const Icon = config.icon

    return (
        <div className={cn(
            "flex items-center justify-center rounded-full p-1.5",
        )}>
            <Icon className={cn(
                "size-3 stroke-3", config.bgColor
            )}/>
        </div>
    )
}
 
export default ConversationStatusIcon;