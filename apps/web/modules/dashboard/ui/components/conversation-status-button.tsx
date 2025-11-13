import { Doc } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import Hint from "@workspace/ui/components/hint";
import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";

interface ConversationStatusButtonProps {
    status: Doc<"conversations">["status"];
    onClick: () => void;
}

const ConversationStatusButton = ({
    status,
    onClick
}: ConversationStatusButtonProps) => {
    if (status === "resolved") {
        return (
            <Hint text="Mark as unresolved">
                <Button onClick={onClick} variant={"default"}>
                    <CheckIcon />
                    Resolved
                </Button>
            </Hint>
        );
    }

    if (status === "unresolved") {
        return (
            <Hint text="Mark as escalated">
                <Button onClick={onClick} variant={"destructive"}>
                    <ArrowRightIcon />
                    Unresolved
                </Button>
            </Hint>
        );
    }

    return (
        <Hint text="Mark as resolved">
            <Button onClick={onClick} variant={"default"}>
                <ArrowUpIcon />
                Escalated
            </Button>
        </Hint>
    );
};

export default ConversationStatusButton;