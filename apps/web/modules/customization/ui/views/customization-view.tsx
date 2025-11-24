"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Spinner } from "@workspace/ui/components/spinner";
import { CustomizationForm } from "../components/customization-form";

const CustomizationView = () => {
    const widgetSettings = useQuery(api.private.widgetSettings.getOne, {});
    const vapiPlugin = useQuery(api.private.plugins.getOne, { service: "vapi" });

    const isLoading = widgetSettings === undefined || vapiPlugin === undefined;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <Spinner className="size-6" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-muted p-8">
            <div className="mx-auto w-full max-w-3xl">
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-4xl">Widget Customization</h1>
                    <p className="text-muted-foreground">
                        Customize how your chat widget looks and behivor for your customers
                    </p>
                </div>

                <div className="mt-8">
                    <CustomizationForm
                        initialData={widgetSettings}
                        hasVapiPlugin={!!vapiPlugin}
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomizationView;;;