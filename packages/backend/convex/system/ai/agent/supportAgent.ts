import { openai } from "@ai-sdk/openai";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
    name: "My Agent",
    // TODO: Need change to GLM Model
    languageModel: openai.chat("chatgpt-4o-latest"),
    instructions: "You are a customer support agent",
});