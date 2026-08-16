import { Head, useForm } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    Calendar,
    HeartPulse,
    Home,
    Mail,
    ShieldCheck,
    User,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

const identityErrorFields = [
    'first_name',
    'middle_name',
    'last_name',
    'suffix',
    'gender',
    'birth_date',
    'civil_status',
    'nationality',
];

const accountErrorFields = [
    'mobile_number',
    'alternate_number',
    'email',
    'password',
    'password_confirmation',
];

const fieldClass = 'h-10 rounded-lg text-[13px] font-bold';
const selectClass =
    'h-10 w-full rounded-lg border border-input bg-background px-3 text-[13px] font-bold shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RegisterField =
    | 'first_name'
    | 'middle_name'
    | 'last_name'
    | 'suffix'
    | 'gender'
    | 'birth_date'
    | 'civil_status'
    | 'nationality'
    | 'mobile_number'
    | 'alternate_number'
    | 'email'
    | 'password'
    | 'password_confirmation'
    | 'phase'
    | 'block'
    | 'lot'
    | 'street'
    | 'unit'
    | 'resident_type'
    | 'move_in_date'
    | 'emergency_contact_name'
    | 'emergency_contact_number';

type RegisterErrors = Partial<Record<RegisterField, string>>;

function StepBadge({
    active,
    value,
    label,
}: {
    active: boolean;
    value: number;
    label: string;
}) {
    return (
        <div
            className={`flex items-center gap-2 ${active ? 'text-blue-600' : 'text-muted-foreground'}`}
        >
            <div
                className={`flex size-7 items-center justify-center rounded-full text-[12px] font-black ${active ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'}`}
            >
                {value}
            </div>
            <span className="text-[12px] font-black tracking-wide uppercase">
                {label}
            </span>
        </div>
    );
}

function SectionHeader({
    icon: Icon,
    title,
}: {
    icon: LucideIcon;
    title: string;
}) {
    return (
        <div className="mb-4 flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Icon className="size-4" />
            </div>
            <h2 className="text-[14px] font-black tracking-tight text-[#0A2540] uppercase dark:text-white">
                {title}
            </h2>
        </div>
    );
}

export default function Register() {
    const [step, setStep] = useState(1);
    const [clientErrors, setClientErrors] = useState<RegisterErrors>({});
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        gender: '',
        birth_date: '',
        civil_status: '',
        nationality: 'Filipino',
        mobile_number: '',
        alternate_number: '',
        email: '',
        password: '',
        password_confirmation: '',
        phase: '',
        block: '',
        lot: '',
        street: '',
        unit: '',
        resident_type: 'Owner',
        move_in_date: new Date().toISOString().split('T')[0],
        emergency_contact_name: '',
        emergency_contact_number: '',
    });

    const errorFor = (field: RegisterField) =>
        clientErrors[field] || errors[field];
    const clearClientError = (field: RegisterField) => {
        setClientErrors((currentErrors) => {
            if (!currentErrors[field]) {
                return currentErrors;
            }

            const nextErrors = { ...currentErrors };

            delete nextErrors[field];

            return nextErrors;
        });
    };
    const updateField = <Field extends RegisterField>(
        field: Field,
        value: (typeof data)[Field],
    ) => {
        clearClientError(field);
        setData(field, value);
    };
    const requireField = (
        nextErrors: RegisterErrors,
        field: RegisterField,
        label: string,
    ) => {
        const value = data[field];

        if (typeof value === 'string' && value.trim() === '') {
            nextErrors[field] = `${label} is required.`;
        }
    };
    const validateStep = (targetStep: number) => {
        const nextErrors: RegisterErrors = {};

        if (targetStep === 1) {
            requireField(nextErrors, 'first_name', 'First name');
            requireField(nextErrors, 'last_name', 'Last name');
            requireField(nextErrors, 'gender', 'Gender');
            requireField(nextErrors, 'birth_date', 'Birth date');
            requireField(nextErrors, 'civil_status', 'Civil status');
            requireField(nextErrors, 'nationality', 'Nationality');
        }

        if (targetStep === 2) {
            requireField(nextErrors, 'email', 'Email address');
            requireField(nextErrors, 'mobile_number', 'Mobile number');
            requireField(nextErrors, 'password', 'Password');
            requireField(
                nextErrors,
                'password_confirmation',
                'Password confirmation',
            );

            if (data.email.trim() && !emailPattern.test(data.email)) {
                nextErrors.email = 'Enter a valid email address.';
            }

            if (data.password && data.password.length < 8) {
                nextErrors.password = 'Password must be at least 8 characters.';
            }

            if (
                data.password &&
                data.password_confirmation &&
                data.password !== data.password_confirmation
            ) {
                nextErrors.password_confirmation = 'Passwords do not match.';
            }
        }

        if (targetStep === 3) {
            requireField(nextErrors, 'phase', 'Phase');
            requireField(nextErrors, 'block', 'Block');
            requireField(nextErrors, 'lot', 'Lot');
            requireField(nextErrors, 'street', 'Street name');
            requireField(nextErrors, 'resident_type', 'Resident type');
            requireField(nextErrors, 'move_in_date', 'Move-in date');
            requireField(
                nextErrors,
                'emergency_contact_name',
                'Emergency contact name',
            );
            requireField(
                nextErrors,
                'emergency_contact_number',
                'Emergency contact number',
            );
        }

        setClientErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (!validateStep(3)) {
            return;
        }

        post(store.url(), {
            onError: (formErrors) => {
                const fields = Object.keys(formErrors);

                if (
                    fields.some((field) => identityErrorFields.includes(field))
                ) {
                    setStep(1);

                    return;
                }

                if (
                    fields.some((field) => accountErrorFields.includes(field))
                ) {
                    setStep(2);

                    return;
                }

                setStep(3);
            },
        });
    };

    const nextStep = () => {
        if (!validateStep(step)) {
            return;
        }

        setStep((currentStep) => Math.min(currentStep + 1, 3));
    };
    const previousStep = () =>
        setStep((currentStep) => Math.max(currentStep - 1, 1));

    return (
        <>
            <Head title="Register" />

            <form onSubmit={submit} className="space-y-6">
                <div className="flex items-center justify-center gap-5 border-b border-neutral-100 pb-5 dark:border-neutral-800">
                    <StepBadge active={step === 1} value={1} label="Identity" />
                    <div className="h-px w-12 bg-border" />
                    <StepBadge
                        active={step === 2}
                        value={2}
                        label="Account & Contact"
                    />
                    <div className="h-px w-12 bg-border" />
                    <StepBadge
                        active={step === 3}
                        value={3}
                        label="Residence"
                    />
                </div>

                {step === 1 && (
                    <div className="mx-auto max-w-2xl">
                        <section>
                            <SectionHeader icon={User} title="Identity" />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first_name">
                                        First Name{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="first_name"
                                        value={data.first_name}
                                        onChange={(event) =>
                                            updateField(
                                                'first_name',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                        autoComplete="given-name"
                                        autoFocus
                                    />
                                    <InputError
                                        message={errorFor('first_name')}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="middle_name">
                                        Middle Name
                                    </Label>
                                    <Input
                                        id="middle_name"
                                        value={data.middle_name}
                                        onChange={(event) =>
                                            updateField(
                                                'middle_name',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                        autoComplete="additional-name"
                                    />
                                    <InputError
                                        message={errorFor('middle_name')}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last_name">
                                        Last Name{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="last_name"
                                        value={data.last_name}
                                        onChange={(event) =>
                                            updateField(
                                                'last_name',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                        autoComplete="family-name"
                                    />
                                    <InputError
                                        message={errorFor('last_name')}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="suffix">Suffix</Label>
                                    <Input
                                        id="suffix"
                                        value={data.suffix}
                                        onChange={(event) =>
                                            updateField(
                                                'suffix',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                        placeholder="Jr."
                                    />
                                    <InputError message={errorFor('suffix')} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="gender">
                                        Gender{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <select
                                        id="gender"
                                        value={data.gender}
                                        onChange={(event) =>
                                            updateField(
                                                'gender',
                                                event.target.value,
                                            )
                                        }
                                        className={selectClass}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <InputError message={errorFor('gender')} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="birth_date">
                                        Birth Date{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="birth_date"
                                        type="date"
                                        value={data.birth_date}
                                        onChange={(event) =>
                                            updateField(
                                                'birth_date',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                    />
                                    <InputError
                                        message={errorFor('birth_date')}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="civil_status">
                                        Civil Status{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <select
                                        id="civil_status"
                                        value={data.civil_status}
                                        onChange={(event) =>
                                            updateField(
                                                'civil_status',
                                                event.target.value,
                                            )
                                        }
                                        className={selectClass}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Widowed">Widowed</option>
                                        <option value="Separated">
                                            Separated
                                        </option>
                                    </select>
                                    <InputError
                                        message={errorFor('civil_status')}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="nationality">
                                        Nationality{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nationality"
                                        value={data.nationality}
                                        onChange={(event) =>
                                            updateField(
                                                'nationality',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                    />
                                    <InputError
                                        message={errorFor('nationality')}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {step === 2 && (
                    <div className="mx-auto max-w-2xl">
                        <section>
                            <SectionHeader
                                icon={Mail}
                                title="Account & Contact"
                            />
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">
                                        Email Address{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(event) =>
                                            updateField(
                                                'email',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                        autoComplete="email"
                                    />
                                    <InputError message={errorFor('email')} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="mobile_number">
                                        Mobile Number{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="mobile_number"
                                        value={data.mobile_number}
                                        onChange={(event) =>
                                            updateField(
                                                'mobile_number',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                        autoComplete="tel"
                                    />
                                    <InputError
                                        message={errorFor('mobile_number')}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="alternate_number">
                                        Alternate Number
                                    </Label>
                                    <Input
                                        id="alternate_number"
                                        value={data.alternate_number}
                                        onChange={(event) =>
                                            updateField(
                                                'alternate_number',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                    />
                                    <InputError
                                        message={errorFor('alternate_number')}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">
                                        Password{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        value={data.password}
                                        onChange={(event) =>
                                            updateField(
                                                'password',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                        autoComplete="new-password"
                                    />
                                    <InputError
                                        message={errorFor('password')}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">
                                        Confirm Password{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(event) =>
                                            updateField(
                                                'password_confirmation',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                        autoComplete="new-password"
                                    />
                                    <InputError
                                        message={errorFor(
                                            'password_confirmation',
                                        )}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {step === 3 && (
                    <div className="grid gap-8 lg:grid-cols-2">
                        <section>
                            <SectionHeader icon={Home} title="Address" />
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="phase">
                                        Phase{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="phase"
                                        value={data.phase}
                                        onChange={(event) =>
                                            updateField(
                                                'phase',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                    />
                                    <InputError message={errorFor('phase')} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="block">
                                        Block{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="block"
                                        value={data.block}
                                        onChange={(event) =>
                                            updateField(
                                                'block',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                    />
                                    <InputError message={errorFor('block')} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lot">
                                        Lot{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="lot"
                                        value={data.lot}
                                        onChange={(event) =>
                                            updateField(
                                                'lot',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                    />
                                    <InputError message={errorFor('lot')} />
                                </div>
                                <div className="col-span-2 grid gap-2">
                                    <Label htmlFor="street">
                                        Street Name{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="street"
                                        value={data.street}
                                        onChange={(event) =>
                                            updateField(
                                                'street',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                    />
                                    <InputError message={errorFor('street')} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="unit">Unit</Label>
                                    <Input
                                        id="unit"
                                        value={data.unit}
                                        onChange={(event) =>
                                            updateField(
                                                'unit',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                    />
                                    <InputError message={errorFor('unit')} />
                                </div>
                                <div className="col-span-2 grid gap-2">
                                    <Label htmlFor="resident_type">
                                        Resident Type{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <select
                                        id="resident_type"
                                        value={data.resident_type}
                                        onChange={(event) => {
                                            const residentType =
                                                event.target.value;
                                            clearClientError('resident_type');
                                            setData((current) => ({
                                                ...current,
                                                resident_type: residentType,
                                            }));
                                        }}
                                        className={selectClass}
                                    >
                                        <option value="Owner">Owner</option>
                                        <option value="Tenant">Tenant</option>
                                        <option value="Family Member">
                                            Family Member
                                        </option>
                                        <option value="Helper">Helper</option>
                                    </select>
                                    <InputError
                                        message={errorFor('resident_type')}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-8">
                            <div>
                                <SectionHeader
                                    icon={Calendar}
                                    title="Residency"
                                />
                                <div className="grid gap-2">
                                    <Label htmlFor="move_in_date">
                                        Move-in Date{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="move_in_date"
                                        type="date"
                                        value={data.move_in_date}
                                        onChange={(event) =>
                                            updateField(
                                                'move_in_date',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                    />
                                    <InputError
                                        message={errorFor('move_in_date')}
                                    />
                                </div>
                            </div>

                            <div>
                                <SectionHeader
                                    icon={HeartPulse}
                                    title="Emergency Contact"
                                />
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="emergency_contact_name">
                                            Contact Person Name{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="emergency_contact_name"
                                            value={data.emergency_contact_name}
                                            onChange={(event) =>
                                                updateField(
                                                    'emergency_contact_name',
                                                    event.target.value,
                                                )
                                            }
                                            className={fieldClass}
                                        />
                                        <InputError
                                            message={errorFor(
                                                'emergency_contact_name',
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="emergency_contact_number">
                                            Contact Number{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="emergency_contact_number"
                                            value={
                                                data.emergency_contact_number
                                            }
                                            onChange={(event) =>
                                                updateField(
                                                    'emergency_contact_number',
                                                    event.target.value,
                                                )
                                            }
                                            className={fieldClass}
                                        />
                                        <InputError
                                            message={errorFor(
                                                'emergency_contact_number',
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                <div className="flex flex-col gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
                    <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground">
                        <ShieldCheck className="size-4 text-blue-600" />
                        Required fields are marked with *
                    </div>
                    <div className="flex gap-3">
                        {step > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={previousStep}
                                className="h-10 rounded-xl px-6 text-[13px] font-black"
                            >
                                Back
                            </Button>
                        )}
                        {step < 3 ? (
                            <Button
                                type="button"
                                onClick={nextStep}
                                className="h-10 rounded-xl px-8 text-[13px] font-black"
                            >
                                Continue
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-10 rounded-xl px-8 text-[13px] font-black"
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create Account
                            </Button>
                        )}
                    </div>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={login()}>Log in</TextLink>
                </div>
            </form>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description:
        'Step 1: identity. Step 2: account and contact. Step 3: residence.',
    wide: true,
};
