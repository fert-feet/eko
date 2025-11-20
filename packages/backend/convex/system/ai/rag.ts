import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { RAG } from "@convex-dev/rag";
import { components } from "../../_generated/api";

const googleEmbedding = createGoogleGenerativeAI({
  baseURL: "https://api.mttieeo.com/v1"
});

const rag = new RAG(components.rag, {
  textEmbeddingModel: googleEmbedding.textEmbeddingModel("text-embedding-004"),
  embeddingDimension: 768, // Needs to match your embedding model
});

export default rag;