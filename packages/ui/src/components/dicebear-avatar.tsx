import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { glass } from "@dicebear/collection";

interface DicebearAvatarProps {
    seed: string;
    size?: number;
    className?: string;
    badgeClassName?: string;
    imageUrl?: string;
    badgeImageUrl?: string;
}

const DicebearAvatar = ({
    seed,
    size = 32,
    className,
    imageUrl,
    badgeClassName,
    badgeImageUrl
}: DicebearAvatarProps) => {
    const avetarSrc = useMemo(() => {
        if (imageUrl) {
            return imageUrl;
        }

        const avatar = createAvatar(glass, {
            seed: seed.toLowerCase().trim(),
            size,
        })

        return avatar.toDataUri()
    }, [seed, size]);

    const badgeSize = Math.round(size * 0.5)
};

export default DicebearAvatar;