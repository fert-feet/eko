import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { RAG } from "@convex-dev/rag";
import { components } from "../../_generated/api";
import { glm } from "../../../glm-provider/glm-provider";

const googleEmbedding = createGoogleGenerativeAI({
  // TODO: 模型不可用
  baseURL: "https://api.mttieeo.com/v1"
});

const rag = new RAG(components.rag, {
  textEmbeddingModel: glm.textEmbeddingModel("embedding-3"),
  embeddingDimension: 2048, // Needs to match your embedding model
});

export default rag;