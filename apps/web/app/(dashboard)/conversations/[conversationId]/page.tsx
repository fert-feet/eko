const Page = async ({
    params
}: {
    params: Promise<{
        conversationId: string;
    }>;
}) => {
    const { conversationId } = await params;
    return (
        <div>
            conversationId: {conversationId}
        </div>
    );
};

export default Page;