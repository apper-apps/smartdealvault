import React from 'react';
import PropTypes from 'prop-types';

const Textarea = ({ 
    className = '', 
    placeholder = '', 
    rows = 3, 
    onBlur = () => {}, 
    required = false, 
    ...props 
}) => {
    return (
        <textarea 
            className={className} 
            placeholder={placeholder}
            rows={rows}
            onBlur={onBlur}
            required={required}
            {...props}
        />
    );
};

Textarea.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string, // Made optional to support controlled/uncontrolled patterns
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    id: PropTypes.string,
    rows: PropTypes.number,
    onBlur: PropTypes.func,
    required: PropTypes.bool,
};

export default Textarea;