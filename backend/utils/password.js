import bcrypt from 'bcrypt';

// Función para hashear la contraseña
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Función para comparar contraseña con hash
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
