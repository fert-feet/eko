import { RAG } from "@convex-dev/rag";
import { openai } from "@ai-sdk/openai";
import { components } from "../../_generated/api";
import { glm } from "../../../glm-provider/glm-provider";

const rag = new RAG(components.rag, {
    textEmbeddingModel: openai.embedding("text-embedding-3-large"),
//   TODO: 需要换成真正能用的词嵌入模型
//   textEmbeddingModel: glm("glm-4.5-flash"),
  embeddingDimension: 1536, // Needs to match your embedding model
});

export default rag