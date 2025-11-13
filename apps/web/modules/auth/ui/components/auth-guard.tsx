"use client"

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import React from "react";
import AuthLayer from "../layouts/auth-layout";
import SignInView from "../views/sign-in-view";
import { Spinner } from "@workspace/ui/components/spinner";

const AuthGuard = ({
    children
}: { children: React.ReactNode; }) => {
    return (
        <>
            <AuthLoading>
                <AuthLayer>
                    <Spinner className="size-8" />
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