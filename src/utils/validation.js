// Utilidades de validación y sanitización

// Validar email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string') {
    return { isValid: false, message: 'Email es requerido' };
  }
  
  if (email.length > 254) {
    return { isValid: false, message: 'Email demasiado largo' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Formato de email inválido' };
  }
  
  return { isValid: true };
};

// Validar contraseña
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Contraseña es requerida' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Contraseña demasiado larga' };
  }
  
  // Verificar caracteres especiales y números
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return { 
      isValid: false, 
      message: 'La contraseña debe contener mayúsculas, minúsculas y números' 
    };
  }
  
  return { isValid: true };
};

// Sanitizar texto
export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  // Remover caracteres peligrosos
  return text
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, '') // Remover event handlers
    .trim()
    .substring(0, 1000); // Limitar longitud
};

// Validar nombre
export const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, message: 'Nombre es requerido' };
  }
  
  const sanitizedName = sanitizeText(name);
  
  if (sanitizedName.length < 2) {
    return { isValid: false, message: 'Nombre demasiado corto' };
  }
  
  if (sanitizedName.length > 50) {
    return { isValid: false, message: 'Nombre demasiado largo' };
  }
  
  // Solo permitir letras, espacios y algunos caracteres especiales
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nameRegex.test(sanitizedName)) {
    return { isValid: false, message: 'Nombre contiene caracteres inválidos' };
  }
  
  return { isValid: true, sanitized: sanitizedName };
};

// Validar formulario completo de login
export const validateLoginForm = (email, password) => {
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);
  
  if (!emailValidation.isValid) {
    return { isValid: false, message: emailValidation.message };
  }
  
  if (!passwordValidation.isValid) {
    return { isValid: false, message: passwordValidation.message };
  }
  
  return { isValid: true };
};

// Validar formulario de registro
export const validateRegisterForm = (email, password, displayName) => {
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);
  const nameValidation = validateName(displayName);
  
  if (!emailValidation.isValid) {
    return { isValid: false, message: emailValidation.message };
  }
  
  if (!passwordValidation.isValid) {
    return { isValid: false, message: passwordValidation.message };
  }
  
  if (!nameValidation.isValid) {
    return { isValid: false, message: nameValidation.message };
  }
  
  return { 
    isValid: true, 
    sanitized: {
      email: email.trim().toLowerCase(),
      password,
      displayName: nameValidation.sanitized
    }
  };
}; 