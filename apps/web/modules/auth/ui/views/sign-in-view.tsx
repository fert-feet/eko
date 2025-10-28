import { SignIn } from "@clerk/nextjs";

const SignInView = () => {
    return (
        <SignIn routing="hash" />
    );
};

export default SignInView;