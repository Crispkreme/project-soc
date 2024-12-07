import { Head } from '@inertiajs/react';
import { useEffect, Suspense } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { toast } from 'react-hot-toast';

export default function Dashboard({ message }) {
    
    useEffect(() => {
        if (message) {
            toast.success(message);
        }
    }, [message]);

    console.log("message", message);

    return (

        <Suspense fallback={<div>Loading...</div>}>
            <AdminLayout>
            
                <Head title="Dashboard" />

                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                You're logged in! as BHW
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </Suspense>
    );
}
