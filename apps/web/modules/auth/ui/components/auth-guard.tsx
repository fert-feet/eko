"use client"

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import React from "react";
import AuthLayer from "../layouts/auth-layout";
import SignInView from "../views/sign-in-view";

const AuthGuard = ({
    children
}: { children: React.ReactNode; }) => {
    return (
        <>
            <AuthLoading>
                <AuthLayer>
                    <p>Loading...</p>
                </AuthLayer>
            </AuthLoading>
            <Authenticated>
                {children}
            </Authenticated>
            <Unauthenticated>
                <AuthLayer>
                    <SignInView />
                </AuthLayer>
            </Unauthenticated>
        </>
    );
};

export default AuthGuard;