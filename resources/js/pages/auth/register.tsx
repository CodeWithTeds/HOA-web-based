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

const accountErrorFields = [
    'first_name',
    'middle_name',
    'last_name',
    'suffix',
    'gender',
    'birth_date',
    'civil_status',
    'nationality',
    'mobile_number',
    'alternate_number',
    'email',
    'password',
    'password_confirmation',
];

const fieldClass = 'h-10 rounded-lg text-[13px] font-bold';
const selectClass =
    'h-10 w-full rounded-lg border border-input bg-background px-3 text-[13px] font-bold shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]';

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
        is_head_of_household: true,
        move_in_date: new Date().toISOString().split('T')[0],
        emergency_contact_name: '',
        emergency_contact_number: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        post(store.url(), {
            onError: (formErrors) => {
                if (
                    Object.keys(formErrors).some((field) =>
                        accountErrorFields.includes(field),
                    )
                ) {
                    setStep(1);
                }
            },
        });
    };

    const nextStep = () => setStep(2);
    const previousStep = () => setStep(1);

    return (
        <>
            <Head title="Register" />

            <form onSubmit={submit} className="space-y-6">
                <div className="flex items-center justify-center gap-5 border-b border-neutral-100 pb-5 dark:border-neutral-800">
                    <StepBadge active={step === 1} value={1} label="Account" />
                    <div className="h-px w-12 bg-border" />
                    <StepBadge
                        active={step === 2}
                        value={2}
                        label="Residence"
                    />
                </div>

                {step === 1 && (
                    <div className="grid gap-8 lg:grid-cols-2">
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
                                            setData(
                                                'first_name',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                        autoComplete="given-name"
                                        autoFocus
                                    />
                                    <InputError message={errors.first_name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="middle_name">
                                        Middle Name
                                    </Label>
                                    <Input
                                        id="middle_name"
                                        value={data.middle_name}
                                        onChange={(event) =>
                                            setData(
                                                'middle_name',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                        autoComplete="additional-name"
                                    />
                                    <InputError message={errors.middle_name} />
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
                                            setData(
                                                'last_name',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                        autoComplete="family-name"
                                    />
                                    <InputError message={errors.last_name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="suffix">Suffix</Label>
                                    <Input
                                        id="suffix"
                                        value={data.suffix}
                                        onChange={(event) =>
                                            setData(
                                                'suffix',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                        placeholder="Jr."
                                    />
                                    <InputError message={errors.suffix} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <select
                                        id="gender"
                                        value={data.gender}
                                        onChange={(event) =>
                                            setData(
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
                                    <InputError message={errors.gender} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="birth_date">
                                        Birth Date
                                    </Label>
                                    <Input
                                        id="birth_date"
                                        type="date"
                                        value={data.birth_date}
                                        onChange={(event) =>
                                            setData(
                                                'birth_date',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                    />
                                    <InputError message={errors.birth_date} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="civil_status">
                                        Civil Status
                                    </Label>
                                    <select
                                        id="civil_status"
                                        value={data.civil_status}
                                        onChange={(event) =>
                                            setData(
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
                                    <InputError message={errors.civil_status} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="nationality">
                                        Nationality
                                    </Label>
                                    <Input
                                        id="nationality"
                                        value={data.nationality}
                                        onChange={(event) =>
                                            setData(
                                                'nationality',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                    />
                                    <InputError message={errors.nationality} />
                                </div>
                            </div>
                        </section>

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
                                            setData('email', event.target.value)
                                        }
                                        className={fieldClass}
                                        autoComplete="email"
                                    />
                                    <InputError message={errors.email} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="mobile_number">
                                        Mobile Number
                                    </Label>
                                    <Input
                                        id="mobile_number"
                                        value={data.mobile_number}
                                        onChange={(event) =>
                                            setData(
                                                'mobile_number',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                        autoComplete="tel"
                                    />
                                    <InputError
                                        message={errors.mobile_number}
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
                                            setData(
                                                'alternate_number',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                    />
                                    <InputError
                                        message={errors.alternate_number}
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
                                            setData(
                                                'password',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                        autoComplete="new-password"
                                    />
                                    <InputError message={errors.password} />
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
                                            setData(
                                                'password_confirmation',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                        autoComplete="new-password"
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {step === 2 && (
                    <div className="grid gap-8 lg:grid-cols-2">
                        <section>
                            <SectionHeader icon={Home} title="Address" />
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="phase">Phase</Label>
                                    <Input
                                        id="phase"
                                        value={data.phase}
                                        onChange={(event) =>
                                            setData('phase', event.target.value)
                                        }
                                        className={fieldClass}
                                    />
                                    <InputError message={errors.phase} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="block">Block</Label>
                                    <Input
                                        id="block"
                                        value={data.block}
                                        onChange={(event) =>
                                            setData('block', event.target.value)
                                        }
                                        className={fieldClass}
                                    />
                                    <InputError message={errors.block} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lot">Lot</Label>
                                    <Input
                                        id="lot"
                                        value={data.lot}
                                        onChange={(event) =>
                                            setData('lot', event.target.value)
                                        }
                                        className={fieldClass}
                                    />
                                    <InputError message={errors.lot} />
                                </div>
                                <div className="col-span-2 grid gap-2">
                                    <Label htmlFor="street">Street Name</Label>
                                    <Input
                                        id="street"
                                        value={data.street}
                                        onChange={(event) =>
                                            setData(
                                                'street',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                    />
                                    <InputError message={errors.street} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="unit">Unit</Label>
                                    <Input
                                        id="unit"
                                        value={data.unit}
                                        onChange={(event) =>
                                            setData('unit', event.target.value)
                                        }
                                        className={fieldClass}
                                    />
                                    <InputError message={errors.unit} />
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
                                            setData((current) => ({
                                                ...current,
                                                resident_type: residentType,
                                                is_head_of_household:
                                                    residentType === 'Owner'
                                                        ? current.is_head_of_household
                                                        : false,
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
                                        message={errors.resident_type}
                                    />
                                </div>
                                <div className="flex items-end pb-2">
                                    <label className="flex items-center gap-2 text-[12px] font-black text-muted-foreground uppercase">
                                        <input
                                            type="checkbox"
                                            checked={data.is_head_of_household}
                                            disabled={
                                                data.resident_type !== 'Owner'
                                            }
                                            onChange={(event) =>
                                                setData(
                                                    'is_head_of_household',
                                                    event.target.checked,
                                                )
                                            }
                                            className="size-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 disabled:opacity-40"
                                        />
                                        H.O.H
                                    </label>
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
                                        Move-in Date
                                    </Label>
                                    <Input
                                        id="move_in_date"
                                        type="date"
                                        value={data.move_in_date}
                                        onChange={(event) =>
                                            setData(
                                                'move_in_date',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                    />
                                    <InputError message={errors.move_in_date} />
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
                                            Contact Person Name
                                        </Label>
                                        <Input
                                            id="emergency_contact_name"
                                            value={data.emergency_contact_name}
                                            onChange={(event) =>
                                                setData(
                                                    'emergency_contact_name',
                                                    event.target.value,
                                                )
                                            }
                                            className={fieldClass}
                                        />
                                        <InputError
                                            message={
                                                errors.emergency_contact_name
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="emergency_contact_number">
                                            Contact Number
                                        </Label>
                                        <Input
                                            id="emergency_contact_number"
                                            value={
                                                data.emergency_contact_number
                                            }
                                            onChange={(event) =>
                                                setData(
                                                    'emergency_contact_number',
                                                    event.target.value,
                                                )
                                            }
                                            className={fieldClass}
                                        />
                                        <InputError
                                            message={
                                                errors.emergency_contact_number
                                            }
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
                        {step === 2 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={previousStep}
                                className="h-10 rounded-xl px-6 text-[13px] font-black"
                            >
                                Back
                            </Button>
                        )}
                        {step === 1 ? (
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
    description: 'Step 1: account details. Step 2: resident profile.',
    wide: true,
};
