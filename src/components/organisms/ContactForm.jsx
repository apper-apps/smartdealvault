import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const ContactForm = forwardRef((props, ref) => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email address is invalid';
    if (!subject) newErrors.subject = 'Subject is required';
    if (!message) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'subject') setSubject(value);
    else if (name === 'message') setMessage(value);
    
    if (errors[name]) {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }
  };

  const clearForm = () => {
    setEmail('');
    setSubject('');
    setMessage('');
    setErrors({});
  };

  useImperativeHandle(ref, () => ({
    clearForm: clearForm,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form Submitted:', { email, subject, message });
      toast.success('Message sent successfully!');
      clearForm();
    } else {
      toast.error('Please correct the form errors.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={handleChange}
        placeholder="your.email@example.com"
        error={errors.email}
      />
      <FormField
        label="Subject"
        name="subject"
        type="text"
        value={subject}
        onChange={handleChange}
        placeholder="Regarding your service"
        error={errors.subject}
      />
      <FormField
        label="Message"
        name="message"
        type="textarea"
        rows={4}
        value={message}
        onChange={handleChange}
        placeholder="Your message here..."
        error={errors.message}
      />
      <Button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Send Message
      </Button>
    </form>
  );
});

ContactForm.displayName = 'ContactForm';

export default ContactForm;