import { Form } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import InputField from '@/components/ui/input-field';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type LoginFormProps = {
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function LoginForm({ canResetPassword, canRegister }: LoginFormProps) {
    return (
        <Form
            {...store.form()}
            resetOnSuccess={['password']}
            className="flex flex-col gap-6"
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid gap-6">
                        <InputField
                            id="email"
                            label="Email address"
                            type="email"
                            name="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            placeholder="email@example.com"
                            error={errors.email}
                        />

                        <InputField
                            id="password"
                            label="Password"
                            type="password"
                            name="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            placeholder="Password"
                            error={errors.password}
                            rightLabel={
                                canResetPassword ? (
                                    <TextLink
                                        href={request()}
                                        tabIndex={5}
                                    >
                                        Forgot password?
                                    </TextLink>
                                ) : null
                            }
                        />

                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                tabIndex={3}
                            />
                            <Label htmlFor="remember">Remember me</Label>
                        </div>

                        <Button
                            type="submit"
                            className="mt-4 w-full"
                            tabIndex={4}
                            disabled={processing}
                            data-test="login-button"
                        >
                            {processing && <Spinner />}
                            Log in
                        </Button>
                    </div>

                    {canRegister && (
                        <div className="text-center text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <TextLink href={register()} tabIndex={5}>
                                Sign up
                            </TextLink>
                        </div>
                    )}
                </>
            )}
        </Form>
    );
}
