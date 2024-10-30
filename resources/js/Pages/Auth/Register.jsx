import InputError from '@/Components/Inputs/InputError';
import InputLabel from '@/Components/Inputs/InputLabel';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import TextInput from '@/Components/Inputs/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import HomeLayout from '../../Layouts/HomeLayout';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        // post(route('register'), {
        //     onFinish: () => reset('password', 'password_confirmation'),
        // });

        post(route('register.store'), {
            onSuccess: () => {
                reset('password', 'password_confirmation');
            },
            onError: (errors) => {
                console.error(errors);
            }
        });
    };

    return (
        <HomeLayout>
            <div className='h-full w-full flex flex-col justify-center'>
                <div className='flex flex-col justify-center items-center'>
                    <div className='mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg z-50'>
                        <Head title="Register" />
                        <form onSubmit={submit}>
                            <div>
                                <InputLabel htmlFor="username" value="Username" />
                                <TextInput
                                    id="username"
                                    name="username"
                                    value={data.username}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('username', e.target.value)}
                                    required
                                />
                                <InputError message={errors.username} className="mt-2" />
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
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
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirm Password"
                                />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>
                            <div className="mt-4 flex items-center justify-end">
                                <Link
                                    href={route('login')}
                                    className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Already registered?
                                </Link>
                                <PrimaryButton className="ms-4" disabled={processing}>
                                    Register
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
                <span className='flex self-center mt-4 text-sm'>Ai-Timan: Streamlining Outpatient Care</span>
            </div>
        </HomeLayout>
    );
}
