
import LoginLayout from '../Layouts/LoginLayout';
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
            <LoginLayout>
                <div className='flex flex-col justify-between p-8 h-full'>
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
            </LoginLayout>
        </>
    );
}
