import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import WidgetHeader from "@/modules/widget/ui/components/widget-header";
import { email } from "zod/v4-mini";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "@workspace/ui/components/input-group";
import { BanIcon, EllipsisIcon, Search } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@workspace/ui/components/tooltip";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useAtomValue, useSetAtom } from "jotai";
import { contactSessionIdAtomFaily, organizationIdAtom } from "@/modules/widget/atoms/widget-atoms";

// TODO: just for temp
const organizationId = "0"

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address")
});

const WidgetAuthScreen = () => {
    const organizationId = useAtomValue(organizationIdAtom)
    const setContactSessionId = useSetAtom(
        contactSessionIdAtomFaily(organizationId)
    )
    
    const creatContactSession = useMutation(api.public.contactSessions.create)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: ""
        }
    });


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!organizationId) {
            return 
        }

        const metadata: Doc<"contactSessions">["metadata"] = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            languages: navigator.languages?.join(","),
            platform: navigator.platform,
            vendor: navigator.vendor,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
            cookieEnabled: navigator.cookieEnabled,
            referrer: document.referrer || "direct",
            currentUrl: window.location.href,
        };

        const contactSessionId = await creatContactSession({
            ...values,
            organizationId,
            metadata
        })

        setContactSessionId(contactSessionId)
    };

    return (
        <>
            <WidgetHeader>
                <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
                    <p className="text-3xl">
                        Hi there! 👋
                    </p>
                    <p className="text-lg">
                        Let&apos;s get you started
                    </p>
                </div>
            </WidgetHeader>
            <Form {...form}>
                <form
                    className="flex flex-1 flex-col gap-y-4 p-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <InputGroup className="h-10 bg-background" {...field}>
                                        <InputGroupInput placeholder="example.com" />
                                        <InputGroupAddon align="inline-end">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <InputGroupButton className="rounded-full" size="icon-xs">
                                                        <EllipsisIcon />
                                                    </InputGroupButton>
                                                </TooltipTrigger>
                                                <TooltipContent>Enter name</TooltipContent>
                                            </Tooltip>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <InputGroup className="h-10 bg-background" {...field}>
                                        <InputGroupInput placeholder="example.com" />
                                        <InputGroupAddon align="inline-end">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <InputGroupButton className="rounded-full" size="icon-xs">
                                                        <EllipsisIcon />
                                                    </InputGroupButton>
                                                </TooltipTrigger>
                                                <TooltipContent>Enter email</TooltipContent>
                                            </Tooltip>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        disabled={form.formState.isSubmitting}
                        size={"lg"}
                        type="submit"
                    >
                        continue
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default WidgetAuthScreen;