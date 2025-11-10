import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface ConversationStatusIconProps {
    status: "unresolved" | "escalated" | "resolved"
}

const statusConfig = {
    resolved: {
        icon: CheckIcon
    },

    escalated: {
        icon: ArrowUpIcon
    },

    unresolved: {
        icon: ArrowRightIcon
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
            <Icon className="size-3 stroke-3 text-primary"/>
        </div>
    )
}
 
export default ConversationStatusIcon;