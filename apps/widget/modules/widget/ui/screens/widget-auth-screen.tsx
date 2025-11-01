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

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address")
});

const WidgetAuthScreen = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: ""
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
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