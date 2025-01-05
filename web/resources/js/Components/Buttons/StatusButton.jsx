import { TbUserExclamation, TbUserShield } from 'react-icons/tb';

const StatusButton = ({ status, onClick, className }) => {
    
    let buttonText, buttonClass, icon, isDisabled;

    switch (status) {
        case 'Accept':
            buttonText = 'Accept';
            buttonClass = 'bg-yellow-50 text-yellow-500 hover:text-yellow-600';
            icon = <TbUserExclamation className="mr-1" />;
            isDisabled = false;
            break;
        case 'Pending':
            buttonText = 'Pending';
            buttonClass = 'bg-blue-50 text-blue-500 hover:text-blue-600';
            icon = <TbUserExclamation className="mr-1" />;
            isDisabled = false;
            break;
        case 'Approve':
            buttonText = 'Approved';
            buttonClass = 'bg-green-50 text-green-500 hover:text-green-600';
            icon = '';
            isDisabled = false;
            break;
        case 'Success':
            buttonText = 'Completed';
            buttonClass = 'bg-green-50 text-green-500 hover:text-green-600';
            icon = <TbUserShield className="mr-1" />;
            isDisabled = true;
            break;
        case 'Cancel':
            buttonText = 'Cancelled';
            buttonClass = 'bg-red-50 text-red-500 hover:text-red-600';
            icon = <TbUserExclamation className="mr-1" />;
            isDisabled = true;
            break;
        case 'Failed':
            buttonText = 'Cancel';
            buttonClass = 'bg-red-50 text-red-500 hover:text-red-600';
            icon = <TbUserExclamation className="mr-1" />;
            isDisabled = false;
            break;
        default:
            buttonText = 'Unknown';
            buttonClass = 'bg-gray-50 text-gray-500';
            icon = <TbUserExclamation className="mr-1" />;
            isDisabled = false;
            break;
    }
    
    return (
        <button 
            type="button"
            className={`w-32 text-sm font-medium py-2 px-4 flex items-center justify-center ${buttonClass} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isDisabled}
            onClick={isDisabled ? undefined : onClick}
        >
            {icon} {buttonText}
        </button>
    );
    
};

export default StatusButton;
