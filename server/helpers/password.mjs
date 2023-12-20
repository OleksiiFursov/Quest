import bcrypt from 'bcrypt'

const saltRounds = 11;

// Функция для хеширования пароля
export async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw error;
  }
}

// Функция для проверки пароля
export async function comparePasswords(inputPassword, hashedPassword) {
  try {
    return await bcrypt.compare(inputPassword, hashedPassword);
  } catch (error) {
    throw error;
  }
}
