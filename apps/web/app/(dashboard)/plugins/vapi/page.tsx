import PremiumFeatureOverlay from "@/modules/dashboard/ui/components/premium-feature-overlay";
import VapiView from "@/modules/plugins/ui/vapi-view";
import { Protect } from "@clerk/nextjs";

const Page = () => {
    return (
        <Protect
            condition={(has) => has({ plan: "pro" })}
            fallback={
                <PremiumFeatureOverlay>
                    <VapiView />
                </PremiumFeatureOverlay>
            }
        >
            <VapiView />
        </Protect>
    )
}
 
export default Page;