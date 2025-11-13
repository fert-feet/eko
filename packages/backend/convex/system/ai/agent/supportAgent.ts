import { Agent } from "@convex-dev/agent";
import { glm } from "../../../../glm-provider/glm-provider";
import { components } from "../../../_generated/api";
import { resolveConversation } from "../tools/resolveConversation";
import { escalateConversation } from "../tools/escalateConversation";

export const supportAgent = new Agent(components.agent, {
    name: "My Agent",
    languageModel: glm("glm-4-flash-250414"),
    instructions: `You are a customer support agent. Use "resolveConversation" tool when user expresses finalization of the conversation. Use "escalateConversation" tool when user expresses frustration, or requests a human explicitly.`,
    providerOptions: {
        "thinking": {
            "type": "disabled",
        },
    }
});
