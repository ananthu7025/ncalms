/* eslint-disable @typescript-eslint/no-explicit-any */
import { isError } from "@/lib/utils";
import { InputHTMLAttributes } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type TextTransformMode = "capitalize" | "uppercase" | "lowercase" | "none";

type InputTextProps<T extends FieldValues> = {
    hookForm: UseFormReturn<T>;
    field: Path<T>;
    label: string;
    errorText?: string;
    labelMandatory?: boolean;
    infoText?: string;
    showInfoIcon?: boolean;
    textTransformMode?: TextTransformMode;
    onConditionCheck?: (newValue: string, oldValue: string) => boolean;
} & InputHTMLAttributes<HTMLInputElement>;

const InputText = <T extends FieldValues>({
    hookForm,
    field,
    label,
    labelMandatory,
    infoText,
    showInfoIcon,
    textTransformMode = "none",
    onConditionCheck,
    className,
    ...props
}: InputTextProps<T>) => {
    const {
        register,
        formState: { errors },
        setValue,
        getValues,
    } = hookForm;

    const textTransformHandler = (value: string) => {
        switch (textTransformMode) {
            case "capitalize":
                return value.length > 0
                    ? value.charAt(0).toUpperCase() + value.slice(1)
                    : value;
            case "uppercase":
                return value.toUpperCase();
            case "lowercase":
                return value.toLowerCase();
            default:
                return value;
        }
    };

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

            <Input
                id={String(field)}
                className={`${hasError ? "border-destructive focus-visible:ring-destructive" : ""} ${className || ""}`}
                {...props}
                {...register(field, {
                    onChange: (e) => {
                        const oldValue = getValues(field) as string;
                        const newValue = textTransformHandler(e.target.value);
                        if (onConditionCheck && !onConditionCheck(newValue, oldValue)) {
                            e.preventDefault();
                            return;
                        }

                        setValue(field, newValue as any, { shouldValidate: true });
                    },
                })}
            />
            {errorMessage && typeof errorMessage === "string" && (
                <p className="text-[0.8rem] font-medium text-destructive">{errorMessage}</p>
            )}
        </div>
    );
};

export default InputText;
