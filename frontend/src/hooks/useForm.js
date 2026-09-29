import { useState } from "react";

const useForm = (initialValues = {}, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setValues((previousValues) => ({
      ...previousValues,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const setFieldValue = (name, value) => {
    setValues((previousValues) => ({
      ...previousValues,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const setFieldError = (name, message) => {
    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: message,
    }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();

    if (!onSubmit) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      await onSubmit(values);
    } catch (error) {
      setErrors({
        form: error?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    setFieldValue,
    setFieldError,
    setErrors,
    handleSubmit,
    resetForm,
  };
};

export default useForm;