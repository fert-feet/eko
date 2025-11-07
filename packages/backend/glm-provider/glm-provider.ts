import {
    OpenAICompatibleChatLanguageModel
} from '@ai-sdk/openai-compatible';
import { LanguageModelV2 } from '@ai-sdk/provider';
import {
    FetchFunction,
    loadApiKey,
    withoutTrailingSlash,
} from '@ai-sdk/provider-utils';
import { GLMChatModelId } from './glm-chat-settings.js';
// Import your model id and settings here.

export interface GLMProviderSettings {
    /**
  Example API key.
  */
    apiKey?: string;
    /**
  Base URL for the API calls.
  */
    baseURL?: string;
    /**
  Custom headers to include in the requests.
  */
    headers?: Record<string, string>;
    /**
  Optional custom url query parameters to include in request urls.
  */
    queryParams?: Record<string, string>;
    /**
  Custom fetch implementation. You can use it as a middleware to intercept requests,
  or to provide a custom fetch implementation for e.g. testing.
  */
    fetch?: FetchFunction;
}

export interface GLMProvider {
    /**
  Creates a model for text generation.
  */
    (
        modelId: GLMChatModelId,
        // settings?: ExampleChatSettings,
    ): LanguageModelV2;

    (
        chatModelId: GLMChatModelId,
    ): LanguageModelV2;
}

export function createGLM(
    options: GLMProviderSettings = {},
): GLMProvider {
    const baseURL = withoutTrailingSlash(
        options.baseURL ?? 'https://open.bigmodel.cn/api/paas/v4/',
    );
    const getHeaders = () => ({
        Authorization: `Bearer ${loadApiKey({
            apiKey: options.apiKey,
            environmentVariableName: 'GLM_API_KEY',
            description: 'glm api key',
        })}`,
        ...options.headers,
    });

    interface CommonModelConfig {
        provider: string;
        url: ({ path }: { path: string; }) => string;
        headers: () => Record<string, string>;
        fetch?: FetchFunction;
    }

    const getCommonModelConfig = (modelType: string): CommonModelConfig => ({
        provider: `glm.${modelType}`,
        url: ({ path }) => {
            const url = new URL(`${baseURL}${path}`);
            if (options.queryParams) {
                url.search = new URLSearchParams(options.queryParams).toString();
            }
            return url.toString();
        },
        headers: getHeaders,
        fetch: options.fetch,
    });

    const createChatModel = (
        modelId: GLMChatModelId,
        // settings: ExampleChatSettings = {},
    ) => {
        return new OpenAICompatibleChatLanguageModel(
            modelId,
            getCommonModelConfig('chat'),
        );
    };

    const provider = (
        modelId: GLMChatModelId,
        // settings?: ExampleChatSettings,
    ) => createChatModel(modelId);

    provider.chatModel = createChatModel;

    return provider;
}

// Export default instance
export const glm = createGLM();