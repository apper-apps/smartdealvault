import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ 
    type = 'text',
    className = '',
    placeholder = '',
    onBlur = () => {},
    required = false,
    ...props 
}) => {
    return (
        <input 
            type={type}
            className={className} 
            placeholder={placeholder}
            onBlur={onBlur}
            required={required}
            {...props} 
        />
    );
};

Input.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string, // Made optional for controlled/uncontrolled pattern
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    id: PropTypes.string,
    onBlur: PropTypes.func,
    required: PropTypes.bool,
};

export default Input;