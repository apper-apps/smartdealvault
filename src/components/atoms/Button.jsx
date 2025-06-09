import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ 
    children, 
    className = '', 
    onClick = () => {}, 
    type = 'button',
    ...props 
}) => {
    return (
        <button className={className} onClick={onClick} type={type} {...props}>
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string,
};

export default Button;