import { Doc } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import Hint from "@workspace/ui/components/hint";
import { CheckIcon } from "lucide-react";

interface ConversationStatusButtonProps {
    status: Doc<"conversations">["status"];
    onClick: () => void;
}

const ConversationStatusButton = ({
    status,
    onClick
}: ConversationStatusButtonProps) => {
    if (status === "resolved") {
        <Hint text="Mark as unresolved">
            <Button onClick={onClick} variant={"default"}>
                <CheckIcon />
                Resolved
            </Button>
        </Hint>;
    }
};

export default ConversationStatusButton;