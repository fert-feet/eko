import Image from "next/image";

const ConversationsView = () => {
    return ( 
        <div className="flex h-full flex-1 flex-col gap-y-4 bg-muted">
            <div className="flex flex-1 items-center justify-center gap-x-2">
                <Image alt="Logo" src="/eko-logo.svg" height={40} width={40} />
                <p className="font-semibold text-lg">EKO</p>
            </div>
        </div>
     );
}
 
export default ConversationsView;