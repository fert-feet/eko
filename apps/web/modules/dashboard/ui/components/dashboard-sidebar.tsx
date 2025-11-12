"use client";

import { Calendar, CreditCardIcon, InboxIcon, LayoutDashboardIcon, LibraryBigIcon, Mic, PaletteIcon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@workspace/ui/components/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { cn } from "@workspace/ui/lib/utils";

const customerSupportItems = [
    {
        title: "Conversations",
        url: "/conversations",
        icon: InboxIcon,
    },
    {
        title: "Knowledge Base",
        url: "/knowledge",
        icon: LibraryBigIcon,
    },
];

const configurationItems = [
    {
        title: "Widget Customization",
        url: "/customization",
        icon: PaletteIcon,
    },
    {
        title: "Integrations",
        url: "/integrations",
        icon: LayoutDashboardIcon,
    },
    {
        title: "Voice Assistant",
        url: "/plugins/vapi",
        icon: Mic,
    },
];

const accountItems = [
    {
        title: "Plans & Billing",
        url: "/billing",
        icon: CreditCardIcon,
    },
];

const DashboardSidebar = () => {
    const pathname = usePathname();

    // 激活标签状态
    // TODO 笔记点
    const isActive = (url: string) => {
        if (url === "/") {
            return pathname === "/";
        }

        return pathname.startsWith(url);
    };

    return (
        <Sidebar className="group" collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size={"lg"}>
                            <OrganizationSwitcher
                                hidePersonal
                                skipInvitationScreen
                                // appearance 属性用于自定义组件的视觉呈现
                                appearance={{
                                    // elements 对象定义了组件内部各个子元素的样式类
                                    elements: {
                                        rootBox: "w-full! h-8!",
                                        avatarBox: "size-4! rounded-sm!",
                                        organizationSwitcherTrigger: "w-full! justify-start! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
                                        organizationPreview: "group-data-[collapsible=icon]:justify-center! gap-2!",
                                        organizationPreviewTextContainer: "group-data-[collapsible=icon]:hidden! text-xs! font-medium! text-sidebar-foreground!",
                                        organizationSwitcherTriggerIcon: "group-data-[collapsible=icon]:hidden! ml-auto! text-sidebar-foreground!"
                                    }
                                }}
                            />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* customer support */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Customer Support</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {customerSupportItems.map(((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.url)}
                                        tooltip={item.title}
                                        className={cn(
                                            isActive(item.url) && "bg-gray-500! text-amber-50!"
                                        )}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* configuration */}
                <SidebarGroup>
                    <SidebarGroupLabel>Configurations</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {configurationItems.map(((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.url)}
                                        tooltip={item.title}
                                        className={cn(
                                            isActive(item.url) && "bg-gray-500! text-amber-50!"
                                        )}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* account */}
                <SidebarGroup>
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {accountItems.map(((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.url)}
                                        tooltip={item.title}
                                        // className={cn(
                                        //     isActive(item.url) && "bg-gradient-to-b from-sidebar-primary to-[#0b63f3]! text-sidebar-primary-foreground! hover:to-[#0b63f3]/90!"
                                        // )}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <UserButton
                            showName
                            appearance={{
                                elements: {
                                    rootBox: "w-full! h-8!",
                                    userButtonTrigger: "w-full! p-2! hover:bg-sidebar-accent! hover:text-sidebar-accent-foreground! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
                                    userButtonBox: "w-full! flex-row-reverse! justify-end! gap-2! group-data-[collapsible=icon]:justify-center! text-sidebar-foreground!",
                                    userButtonOuterIdentifier: "pl-0! group-data-[collapsible=icon]:hidden!",
                                    avatarBox: "size-5!"
                                }
                            }}
                        />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
};

export default DashboardSidebar;