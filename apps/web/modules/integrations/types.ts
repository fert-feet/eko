import { INTEGRATIONS } from "./constants";

// 让类型局限为已定义的 "Integration" 的类型
export type IntegrationId = (typeof INTEGRATIONS)[number]["id"]