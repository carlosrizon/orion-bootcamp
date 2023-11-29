// Enum dos tipos de gênero disponíveis para cadastro de usuários na plataforma
enum Gender {
  'female' = 'Mulher (cis ou trans)',
  'male' = 'Homem (cis ou trans)',
  'non-binary' = 'Não Binário',
  'unknown' = 'Prefiro não dizer'
}

/**
 * Classe auxiliar que fornece valores constantes a serem utilizados como parâmetros para validação de dados do usuário a ser cadastrado
 */
export default class UserValidatorParams {
  /**
   * Método que retorna os tipos de gênero disponíveis, para validação de dados do usuário
   * @returns {typeof Gender} - Enum dos tipos de gênero
   */
  genderTypes(): typeof Gender {
    return Gender;
  }

  /**
   * Método que retorna idade mínima permitida, para validação de dados do usuário
   * @returns {number} - idade mínima permitida
   */
  minimunAgeAllowed = (): number => {
    return 10;
  };

  /**
   * Método que retorna idade máxima considerada factível, para validação de dados do usuário
   * @returns {number} - idade mínima factível
   */
  maxConsideredAge = (): number => {
    return 100;
  };
}
