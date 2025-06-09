import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ className, ...props }) => {
    return (
        <input className={className} {...props} />
    );
};

Input.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    id: PropTypes.string,
    onBlur: PropTypes.func,
    required: PropTypes.bool,
};

Input.defaultProps = {
    type: 'text',
    className: '',
    placeholder: '',
    onBlur: () => {},
    required: false,
};

export default Input;