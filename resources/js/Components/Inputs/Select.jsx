import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const Select = forwardRef(({ options, className = '', isFocused = false, ...props }, ref) => {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <div>
            <select
                {...props}
                className={
                    'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 mt-1 block w-full' + className
                }
                ref={localRef}
                defaultValue=""
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value} disabled={option.disabled || false}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
});

export default Select;
