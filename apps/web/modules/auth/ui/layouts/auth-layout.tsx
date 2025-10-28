"use client"

import React from "react";

const AuthLayer = ({
    children
}: { children: React.ReactNode }) => {
    return (
        <div className="h-full items-center justify-center flex flex-col min-h-screen min-w-screen">
            {children}
        </div>
    );
};

export default AuthLayer;