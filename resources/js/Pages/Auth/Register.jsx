import { Head, useForm } from '@inertiajs/react';
import LoginLayout from '../../Layouts/LoginLayout';
import MultiStepForm from '../../Components/Forms/MultiStepForm';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // const submit = (e) => {
    //     e.preventDefault();

    //     post(route('register.store'), {
    //         onSuccess: () => {
    //             reset('password', 'password_confirmation');
    //         },
    //         onError: (errors) => {
    //             console.error(errors);
    //         }
    //     });
    // };

    return (
        <LoginLayout>
            <div className='h-full w-full flex flex-col justify-center'>
                <div className='flex flex-col justify-center items-center'>
                    <div className='mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg z-50'>
                        <Head title="Register" />
                        <MultiStepForm />
                    </div>
                </div>
                <span className='flex self-center mt-4 text-sm'>Ai-Timan: Streamlining Outpatient Care</span>
            </div>
        </LoginLayout>
    );
}
