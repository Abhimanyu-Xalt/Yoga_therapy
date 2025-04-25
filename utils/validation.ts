export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long'
    };
  }

  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number'
    };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one special character'
    };
  }

  return {
    isValid: true,
    message: 'Password is valid'
  };
};

export const validateEmail = (email: string): { isValid: boolean; message: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: 'Please enter a valid email address'
    };
  }

  return {
    isValid: true,
    message: 'Email is valid'
  };
};

export const validatePhone = (phone: string): { isValid: boolean; message: string } => {
  // Allow only numbers and optional + at start
  const phoneRegex = /^\+?\d{10,15}$/;
  
  if (!phoneRegex.test(phone)) {
    return {
      isValid: false,
      message: 'Please enter a valid phone number (10-15 digits)'
    };
  }

  return {
    isValid: true,
    message: 'Phone number is valid'
  };
}; 