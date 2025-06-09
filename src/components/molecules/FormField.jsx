import React from 'react';
import PropTypes from 'prop-types';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';

const FormField = ({ 
    label,
    name, 
    type = 'text', 
    value, 
    onChange, 
    placeholder = '', 
    error = '', 
    onBlur = () => {},
    ...props 
}) => {
    const commonClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
    const FieldComponent = type === 'textarea' ? Textarea : Input;

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <FieldComponent
                id={name}
                name={name}
                type={type === 'textarea' ? undefined : type}
                value={value}
                onChange={onChange}
                className={commonClasses}
                placeholder={placeholder}
                onBlur={onBlur}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    onBlur: PropTypes.func,
    rows: PropTypes.number,
};

export default FormField;