import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import Image from "next/image";
import { Button } from "../../../../../../packages/ui/src/components/button";
import { UnplugIcon } from "lucide-react";
import { useVapiPhoneNumbers } from "../hooks/use-vapi-data";

interface VapiConnectedViewProps {
    onDisconnect: () => void;
}

const VapiConnectedView = ({ onDisconnect }: VapiConnectedViewProps) => {
    const [activeTab, setActiveTab] = useState("phone-numbers");

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Image
                                alt="Vapi"
                                className="rounded-lg object-contain"
                                height={48}
                                width={48}
                                src={"/vapi.svg"}
                            />
                            <div>
                                <CardTitle>Vapi Integration</CardTitle>
                                <CardDescription>
                                    Manage your phone numbers and AI assistants
                                </CardDescription>
                            </div>
                        </div>

                        <Button onClick={onDisconnect} size={"sm"} variant={"destructive"}>
                            <UnplugIcon />
                            Disconnect
                        </Button>
                    </div>
                </CardHeader>

            </Card>
        </div>
    );
};

export default VapiConnectedView;