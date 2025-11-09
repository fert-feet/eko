import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
    status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted",
    loadMore: (numItem: number) => void,
    loadSize?: number,
    observerEnabled?: boolean;
}

const useInfiniteScroll = ({
    status,
    loadMore,
    loadSize = 10,
    observerEnabled = true
}: UseInfiniteScrollProps) => {
    const topElementRef = useRef<HTMLDivElement>(null);

    // 使用 "useCallback" 防止由于函数引用变化导致 "useEffect" 重复执行
    const handleLoadMore = useCallback(() => {
        if (status === "CanLoadMore") {
            loadMore(loadSize);
        }
    }, [status, loadMore, loadSize]);

    useEffect(() => {
        const topElement = topElementRef.current;

        // 若没有要监听的 DOM，或禁用了监听，直接返回（不初始化观察者）
        if (!(topElement && observerEnabled)) {
            return;
        }

        //
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    handleLoadMore();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(topElement);

        return () => {
            observer.disconnect();
        };

    }, [handleLoadMore, observerEnabled]);

    return {
        topElementRef,
        handleLoadMore,
        canLoadMore: status === "CanLoadMore",
        isLoadingMore: status === "LoadingMore",
        isLoadingFirstPage: status === "LoadingFirstPage",
        isExhausted: status === "Exhausted",
    };
};

export default useInfiniteScroll