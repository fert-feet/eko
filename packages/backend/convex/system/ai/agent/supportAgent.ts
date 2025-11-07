import { Agent } from "@convex-dev/agent";
import { glm } from "../../../../glm-provider/glm-provider";
import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
    name: "My Agent",
    // TODO: Need change to GLM Model
    languageModel: glm("glm-4.5-flash"),
    instructions: "You are a customer support agent",
});
