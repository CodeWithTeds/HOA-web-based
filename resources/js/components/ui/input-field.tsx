import { ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    htmlFor?: string;
    rightLabel?: ReactNode;
}

export default function InputField({
    label,
    error,
    htmlFor,
    rightLabel,
    id,
    type = 'text',
    ...props
}: InputFieldProps) {
    const inputId = id || htmlFor || props.name;
    
    return (
        <div className="grid gap-2">
            <div className="flex items-center">
                <Label htmlFor={inputId}>{label}</Label>
                {rightLabel && (
                    <div className="ml-auto text-sm">
                        {rightLabel}
                    </div>
                )}
            </div>
            {type === 'password' ? (
                <PasswordInput
                    id={inputId}
                    {...props}
                />
            ) : (
                <Input
                    id={inputId}
                    type={type}
                    {...props}
                />
            )}
            {error && <InputError message={error} />}
        </div>
    );
}
