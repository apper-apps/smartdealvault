import React from 'react';
import PropTypes from 'prop-types';

const Textarea = ({ className, ...props }) => {
    return (
        <textarea className={className} {...props}></textarea>
    );
};

Textarea.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    id: PropTypes.string,
    rows: PropTypes.number,
    onBlur: PropTypes.func,
    required: PropTypes.bool,
};

Textarea.defaultProps = {
    className: '',
    placeholder: '',
    rows: 3,
    onBlur: () => {},
    required: false,
};

export default Textarea;