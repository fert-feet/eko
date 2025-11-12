import React from "react";
import AuthGuard from "@/modules/auth/ui/components/auth-guard";
import { SidebarProvider, SidebarTrigger } from "@workspace/ui/components/sidebar";
import { cookies } from "next/headers";
import DashboardSidebar from "../components/dashboard-sidebar";
import { Provider } from "jotai";

const DashboardLayout = async ({
    children
}: { children: React.ReactNode; }) => {
    const cookieStore = await cookies();

    // 确保不会先展开再收回，而是保持一个默认状态
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

    return (
        <AuthGuard>
            <Provider>
                <SidebarProvider defaultOpen={defaultOpen}>
                    <DashboardSidebar />
                    <main className="flex flex-col flex-1">
                        {/* <SidebarTrigger /> */}
                        {children}
                    </main>
                </SidebarProvider>
            </Provider>
        </AuthGuard>
    );
};

export default DashboardLayout;