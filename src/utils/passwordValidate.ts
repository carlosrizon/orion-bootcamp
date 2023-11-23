export function validatePassword(password: string): boolean {
  // Pelo menos 8 caracteres, 1 letra maiúscula, 1 letra minúscula, 1 número, 1 caractere especial
  const regex =
    /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}
