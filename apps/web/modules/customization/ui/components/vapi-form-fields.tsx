import { useVapiAssistants, useVapiPhoneNumbers } from "@/modules/plugins/ui/hooks/use-vapi-data";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { FormSchema } from "./customization-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Badge } from "@workspace/ui/components/badge";

interface VapiFormFieldsProps {
    form: UseFormReturn<FormSchema>;
}

const VapiFormFields = ({
    form
}: VapiFormFieldsProps) => {
    const { data: assistants, isLoading: assistantsLoading } = useVapiAssistants();
    const { data: phoneNumbers, isLoading: phoneNumbersLoading } = useVapiPhoneNumbers();

    const disabled = form.formState.isSubmitting;

    return (
        <>
            <FormField
                control={form.control}
                name="vapiSettings.assistantId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Voice Assistant</FormLabel>
                        <Select
                            disabled={assistantsLoading || disabled}
                            onValueChange={field.onChange}
                            value={field.value}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={
                                            assistantsLoading
                                                ? "Loading assistants..."
                                                : "select an assistant"
                                        }
                                    />

                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {assistants.map((assistant) => (
                                    <SelectItem key={assistant.id} value={assistant.id}>
                                        {assistant.name || "Unnamed Assistant"} -{" "}
                                        <Badge variant={"outline"} className="rounded-md">
                                            {assistant.model?.model || "Unknow model"}
                                        </Badge>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormDescription>
                            The Vapi assistant to use for voice calls
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="vapiSettings.phoneNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Display phone numbers</FormLabel>
                        <Select
                            disabled={phoneNumbersLoading || disabled}
                            onValueChange={field.onChange}
                            value={field.value}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={
                                            phoneNumbersLoading
                                                ? "Loading phone numbers..."
                                                : "select an phone number"
                                        }
                                    />

                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {phoneNumbers.map((phone) => (
                                    <SelectItem key={phone.id} value={phone.number || phone.id}>
                                        {phone.number || "Unknown"} -{" "}
                                        <Badge variant={"outline"} className="rounded-md">
                                            {phone.name || "Unnamed"}
                                        </Badge>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormDescription>
                            Phone number display in the widget
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
};

export default VapiFormFields;