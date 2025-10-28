import React from "react";
import AuthLayer from "@/modules/auth/ui/layouts/auth-layout";

const Layout = ({
    children
}: { children: React.ReactNode; }) => {
    return (
        <AuthLayer>
            {children}
        </AuthLayer>
    );
};

export default Layout;