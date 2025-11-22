"use client"

import { GlobeIcon, PhoneCallIcon, PhoneIcon, WorkflowIcon } from "lucide-react";
import PluginCard, { Feature } from "./components/plugin-card";

const vapiFeatures: Feature[] = [
    {
        icon: GlobeIcon,
        label: "Web voice calls",
        description: "Voice chat directly in your app"
    },
    {
        icon: PhoneIcon,
        label: "Phone numbers",
        description: "Get dedicated business lines",
    },
    {
        icon: PhoneCallIcon,
        label: "Outbound calls",
        description: "Automated customer outreach",
    },
    {
        icon: WorkflowIcon,
        label: "Workflows",
        description: "Custom conversation flows",
    },
];

const VapiView = () => {
    return (
        <div className="flex min-h-screen flex-col bg-muted p-8">
            <div className="mx-auto w-full max-w-3xl">
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-4xl">Vapi Plugin</h1>
                    <p className="text-muted-foreground">Connect Vapi to enable AI voice calls and phone support</p>
                </div>

                <div className="mt-8">
                    <PluginCard onSubmit={() => {}} serviceImage="/vapi.svg" serviceName="Vapi" features={vapiFeatures} />
                </div>
            </div>
        </div>
    );
};

export default VapiView;