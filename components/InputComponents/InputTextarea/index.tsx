/* eslint-disable @typescript-eslint/no-explicit-any */
import { isError } from "@/lib/utils";
import { TextareaHTMLAttributes } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type InputTextareaProps<T extends FieldValues> = {
    hookForm: UseFormReturn<T>;
    field: Path<T>;
    label: string;
    errorText?: string;
    labelMandatory?: boolean;
    infoText?: string;
    showInfoIcon?: boolean;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

const InputTextarea = <T extends FieldValues>({
    hookForm,
    field,
    label,
    labelMandatory,
    infoText,
    showInfoIcon,
    className,
    ...props
}: InputTextareaProps<T>) => {
    const {
        register,
        formState: { errors },
    } = hookForm;

    const hasError = isError(errors, field);
    const errorMessage = (errors[field as string] as any)?.message;

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Label htmlFor={String(field)} className={hasError ? "text-destructive" : ""}>
                    {label} {labelMandatory && <span className="text-destructive">*</span>}
                </Label>
                {showInfoIcon && infoText && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs">{infoText}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>

            <Textarea
                id={String(field)}
                className={`${hasError ? "border-destructive focus-visible:ring-destructive" : ""} ${className || ""}`}
                {...props}
                {...register(field)}
            />
            {errorMessage && typeof errorMessage === "string" && (
                <p className="text-[0.8rem] font-medium text-destructive">{errorMessage}</p>
            )}
        </div>
    );
};

export default InputTextarea;
