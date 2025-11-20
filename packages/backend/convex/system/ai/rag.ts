import { RAG } from "@convex-dev/rag";
import { createGoogleGenerativeAI, google } from "@ai-sdk/google";
import { components } from "../../_generated/api";
import { glm } from "../../../glm-provider/glm-provider";

const googleEmbedding = createGoogleGenerativeAI({
  baseURL: "https://api.mttieeo.com/v1"
});

const rag = new RAG(components.rag, {
  textEmbeddingModel: googleEmbedding.textEmbeddingModel("text-embedding-004"),
  embeddingDimension: 768, // Needs to match your embedding model
});

export default rag;