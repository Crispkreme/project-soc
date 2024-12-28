import React from 'react';

const Textarea = ({
  id = 'textarea',
  name = 'textarea',
  rows = 3,
  placeholder = '',
  className = '',
  value = '',
  onChange,
  helperText = '',
  disabled = false,
}) => {
  return (
    <div>
      <div className="mt-2">
        <textarea
          id={id}
          name={name}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 mt-1 block w-full ${className}`}
        ></textarea>
      </div>
      {helperText && (
        <p className="mt-3 text-sm text-gray-600">{helperText}</p>
      )}
    </div>
  );
};

export default Textarea;
