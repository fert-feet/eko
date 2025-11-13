import { Doc } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import Hint from "@workspace/ui/components/hint";
import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";

interface ConversationStatusButtonProps {
    status: Doc<"conversations">["status"];
    onClick: () => void;
    disabled?: boolean;
}

const ConversationStatusButton = ({
    status,
    onClick,
    disabled
}: ConversationStatusButtonProps) => {
    if (status === "resolved") {
        return (
            <Hint text="Mark as unresolved">
                <Button disabled={disabled} onClick={onClick} variant={"success"}>
                    <CheckIcon />
                    Resolved
                </Button>
            </Hint>
        );
    }

    if (status === "unresolved") {
        return (
            <Hint text="Mark as escalated">
                <Button disabled={disabled} onClick={onClick} variant={"destructive"}>
                    <ArrowRightIcon />
                    Unresolved
                </Button>
            </Hint>
        );
    }

    return (
        <Hint text="Mark as resolved">
            <Button disabled={disabled} onClick={onClick} variant={"warning"}>
                <ArrowUpIcon />
                Escalated
            </Button>
        </Hint>
    );
};

export default ConversationStatusButton;