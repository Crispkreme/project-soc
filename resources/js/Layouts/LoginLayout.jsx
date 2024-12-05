import { Link } from '@inertiajs/react';
import dashboard from '../../../public/assets/svg/dashboard.svg';

export default function LoginLayout({ children }) {
    return (
        <main className='flex overflow-hidden'>
            <nav className='absolute w-full z-50'>
                <ul className='flex justify-end p-8 gap-8 font-bold text-lg'>
                    {
                        [
                            {text: "About us", href: route('login')},
                            {text: "Services", href: route('login')},
                            {text: "Contact us", href: route('login')},
                            {text: "Login", href: route('login')},
                            {text: "Signup", href: route('register')},
                        ].map( obj => {
                            return (
                                <li>
                                    <Link
                                        href={obj.href}
                                        className="rounded-md text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        {obj.text}
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </nav>
            <section className='flex-[1_0_50%] min-h-screen z-50'>
                {children}
            </section>
            <section className='flex flex-[1_0_50%] relative'>
                <div className='relative w-full'>
                    <div className='py-6 px-8 bg-white z-50 absolute right-[-1em] bottom-20 px-8 text-4xl rounded-[10em]'>
                        <span className='bg-[#94D5EA] rounded-[10em] right-[-.5em] relative top-2 py-4 px-16'>LAPAY,BHW</span>
                    </div>
                    <img className='absolute z-30 left-32 top-32 w-[500px]' src={dashboard}/>
                    <div className='absolute rounded-[50%] bottom-32 left-[-20em] w-[1200px] h-[1000px] bg-[#94D5EA]'></div>
                    <div className='absolute top-32 left-32 rounded-[50%] w-[1000px] h-[800px] bg-[#226185]'></div>
                    
                </div>
            </section>
        </main>
    );
}
