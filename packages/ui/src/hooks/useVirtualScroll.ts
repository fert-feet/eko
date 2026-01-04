import { useCallback, useEffect, useRef, useState } from "react";

interface UseVirtualScrollProps {
    listData: any[];
    itemHeight: number;
    containerHeight: number;
    containerRef: React.RefObject<HTMLDivElement>;
}

export const useVirtualScroll = ({
    listData,
    itemHeight,
    containerHeight,
    containerRef
}: UseVirtualScrollProps) => {
    const [visibleRange, setVisibleRange] = useState({
        startIndex: 0,
        endIndex: Math.ceil(containerHeight / itemHeight) + 1
    });

    const scrollTopRef = useRef(0);

    const calculateVisibleRange = useCallback(() => {
        if (!containerRef.current) {
            return;
        }

        const scrollTop = containerRef.current.scrollTop;
        scrollTopRef.current = scrollTop;

        // 向上滚的像素里有几个索引列表项，得到顶部渲染索引
        const startIndex = Math.floor(scrollTop / itemHeight);

        // 顶部渲染的项的索引 + 渲染空间内一共能有多少项，得到底部索引
        const endIndex = startIndex + Math.ceil(containerHeight / itemHeight) + 2;

        setVisibleRange({
            startIndex: Math.max(0, startIndex),
            endIndex: Math.min(listData.length - 1, endIndex)
        });
    }, [containerHeight, itemHeight, listData.length]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const handleScroll = () => {
            calculateVisibleRange();
        };

        container.addEventListener("scroll", handleScroll);
        // 初始化计算一次
        calculateVisibleRange();

        return () => {
            container.removeEventListener("scroll", handleScroll)
        }
    }, [calculateVisibleRange]);

    const getVisibleList = useCallback(() => {
        return listData.slice(visibleRange.startIndex, visibleRange.endIndex + 1)
    }, [listData, visibleRange])

    const getItemOffset = useCallback((index: number) => {
        return index * itemHeight - scrollTopRef.current
    }, [itemHeight])

    const totalListHeight = listData.length * itemHeight

    return {
        visibleRange,
        getVisibleList,
        getItemOffset,
        totalListHeight
    }
};