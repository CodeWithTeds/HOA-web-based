import { Head } from '@inertiajs/react';
import LoginForm from '@/components/auth/login-form';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <LoginForm 
                canResetPassword={canResetPassword} 
                canRegister={canRegister} 
            />
        </>
    );
}

Login.layout = {
    title: 'Sign in to your account',
    description: 'Enter your email and password below to log in',
};
