import React from "react";
import AuthGuard from "@/modules/auth/ui/components/auth-guard";

const Layout = ({
    children
}: { children: React.ReactNode }) => {
    return ( 
        <AuthGuard>
            {children}
        </AuthGuard>
     );
};

export default Layout;