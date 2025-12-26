/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputHTMLAttributes } from "react";
import { FieldValues, Path, UseFormReturn, Controller } from "react-hook-form";
import { Switch } from "@/components/ui/switch"; // Using shadcn switch as base
import { Label } from "@/components/ui/label";

type InputSwitchProps<T extends FieldValues> = {
    hookForm: UseFormReturn<T>;
    field: Path<T>;
    label: string;
    description?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;

const InputSwitch = <T extends FieldValues>({
    hookForm,
    field,
    label,
    description,
}: InputSwitchProps<T>) => {
    const { control } = hookForm;

    return (
        <Controller
            control={control}
            name={field}
            render={({ field: { value, onChange } }) => (
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="font-medium">{label}</Label>
                        {description && (
                            <p className="text-sm text-muted-foreground">{description}</p>
                        )}
                    </div>
                    <Switch
                        checked={value}
                        onCheckedChange={onChange}
                    />
                </div>
            )}
        />
    );
};

export default InputSwitch;
