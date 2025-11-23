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
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const result = await getPhoneNumbers();
                setData(result);
            } catch (error) {
                setError(error as Error);
                toast.error("Failed to fetch phone numbers");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [getPhoneNumbers]);

    return { data, isLoading, error };
};