/* eslint-disable @typescript-eslint/no-explicit-any */
import { isError } from "@/lib/utils";
import { FieldValues, Path, UseFormReturn, Controller } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type Option = {
    value: string | number;
    label: string;
};

type InputSelectProps<T extends FieldValues> = {
    hookForm: UseFormReturn<T>;
    field: Path<T>;
    label: string;
    options: Option[];
    errorText?: string;
    labelMandatory?: boolean;
    infoText?: string;
    showInfoIcon?: boolean;
    placeholder?: string;
    disabled?: boolean;
    className?: string; // Add className
};

const InputSelect = <T extends FieldValues>({
    hookForm,
    field,
    label,
    options,
    labelMandatory,
    infoText,
    showInfoIcon,
    placeholder = "Select option",
    disabled,
    className,
}: InputSelectProps<T>) => {
    const {
        control,
        formState: { errors },
    } = hookForm;

    const hasError = isError(errors, field);
    const errorMessage = (errors[field as string] as any)?.message;

    return (
        <Controller
            control={control}
            name={field}
            render={({ field: { value, onChange } }) => (
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

                    <Select
                        onValueChange={onChange}
                        defaultValue={value}
                        value={value || ""}
                        disabled={disabled}
                    >
                        <SelectTrigger
                            className={`${hasError ? "border-destructive focus:ring-destructive" : ""} ${className || ""}`}
                        >
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option.value} value={String(option.value)}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errorMessage && typeof errorMessage === "string" && (
                        <p className="text-[0.8rem] font-medium text-destructive">{errorMessage}</p>
                    )}
                </div>
            )}
        />
    );
};

export default InputSelect;
