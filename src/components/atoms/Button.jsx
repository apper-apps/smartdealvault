import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, className, ...props }) => {
    return (
        <button className={className} {...props}>
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

Button.defaultProps = {
    className: '',
    onClick: () => {},
    type: 'button',
};

export default Button;