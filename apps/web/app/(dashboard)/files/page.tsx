import FilesView from "@/modules/files/ui/views/files-view";
import { Protect } from "@clerk/nextjs";
import PremiumFeatureOverlay from "@/modules/dashboard/ui/components/premium-feature-overlay";

const Page = () => {
    return (
        <Protect
            condition={(has) => has({ plan: "pro" })}
            fallback={
            <PremiumFeatureOverlay>
                <FilesView />
            </PremiumFeatureOverlay>
        }
        >
            <FilesView />
        </Protect>
    );
};

export default Page;