import { api } from "@workspace/backend/_generated/api";
import { useAction } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type PhoneNumbers = typeof api.private.vapi.getPhoneNumbers._returnType;

// 由于 vapi 不是 convex 数据库的一部分，因此直接在 view 中使用 useAction 获取号码无法做到实时更新，使用一个 useEffect 达到实时更新的目的
export const useVapiPhoneNumbers = (): {
    data: PhoneNumbers;
    isLoading: boolean;
    error: Error | null;
} => {
    const [data, setData] = useState<PhoneNumbers>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const getPhoneNumbers = useAction(api.private.vapi.getPhoneNumbers);

    useEffect(() => {
        let cancelled = false;
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const result = await getPhoneNumbers();

                if (cancelled) {
                    return;
                }

                setData(result);
            } catch (error) {
                if (cancelled) {
                    return;
                }

                setError(error as Error);
                toast.error("Failed to fetch phone numbers");
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            cancelled = true
        }

    }, []);

    return { data, isLoading, error };
};

type Assistants = typeof api.private.vapi.getAssistants._returnType;
export const useVapiAssistants = (): {
    data: Assistants;
    isLoading: boolean;
    error: Error | null;
} => {
    const [data, setData] = useState<Assistants>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const getAssistants = useAction(api.private.vapi.getAssistants);

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const result = await getAssistants();

                if (cancelled) {
                    return;
                }

                setData(result);
            } catch (error) {
                if (cancelled) {
                    return;
                }

                setError(error as Error);
                toast.error("Failed to fetch assistants");
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        // "cancelled" 确保已经卸载的组件不会执行后续的加载（比如点击 tag 后又快速切换，切换后不再加载原来的东西），防止旧数据覆盖新数据
        return () => {
            cancelled = true
        }
    }, []);

    return { data, isLoading, error };
};