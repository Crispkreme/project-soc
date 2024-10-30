import { Head, Link } from '@inertiajs/react';

import HomeLayout from '../Layouts/HomeLayout';
import logo from '../../../public/assets/svg/logo.svg';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            {/* <Head title="Welcome" />
            
            <div>
                {auth.user ? (
                    <Link
                        href={route('dashboard')}
                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link
                            href={route('login')}
                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                        >
                            Log in
                        </Link>
                        <Link
                            href={route('register')}
                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div> */}
            <HomeLayout>
                <div className='flex flex-col h-full justify-between p-8 h-full'>
                    <div>
                        <img src={logo} width={150}/>
                    </div>
                    <div className='flex flex-col gap-8'>
                        <h1 className='text-4xl'>Welcome to</h1>
                        <h1 className='text-8xl font-lily'>Ai-Timan</h1>
                        <h1 className='text-4xl'>Streamlining <br/> Outpation Care</h1>
                    </div>
                    <div>
                        <h1>
                            Ai-Timan: Streamlining Outpatient Care
                        </h1>
                    </div>
                </div>
            </HomeLayout>
        </>
    );
}
