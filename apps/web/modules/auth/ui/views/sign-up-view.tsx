import { SignUp } from "@clerk/nextjs";

const SignUpView = () => {
    return (
        <SignUp routing="hash" />
    );
};

export default SignUpView;