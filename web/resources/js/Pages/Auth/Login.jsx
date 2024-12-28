import React from "react";
import InputError from '@/Components/Inputs/InputError';
import InputLabel from '@/Components/Inputs/InputLabel';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import TextInput from '@/Components/Inputs/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import logo from '../../../../public/assets/svg/logo.svg';
const LoginLayout = React.lazy(() => import("../../Layouts/LoginLayout"));

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <LoginLayout>
            <div className='h-full w-full flex flex-col justify-center'>
                <div className='flex flex-col justify-center items-center'>
                    <div className='mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg z-50'>
                        <Head title="Log in" />

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div className='w-full flex justify-center'>
                                <img src={logo} width={200} height={200} />
                            </div>
                            <div className='mt-8'>
                                <InputLabel htmlFor="email" value="Email" />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />

                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="password" value="Password" />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />

                                <InputError message={errors.password} className="mt-2" />
                            </div>
                            <div className='w-full flex justify-center mt-8'>
                                <PrimaryButton className="ms-4" disabled={processing}>
                                    Log in
                                </PrimaryButton>
                            </div>

                            <div className="mt-4 flex items-center justify-center">
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Forgot your password?
                                    </Link>
                                )}
                            </div>
                            <div className='mt-4 flex justify-center'>
                                <span>Don't have an account? <Link href={route('register')} className='underline'>Sign up</Link></span>
                            </div>
                        </form>
                    </div>
                </div>
                <span className='flex self-center mt-4 text-sm'>Ai-Timan: Streamlining Outpatient Care</span>
            </div>
        </LoginLayout>
    );
}
