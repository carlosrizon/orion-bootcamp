/**
 * @interface
 * Modelo de objeto Survey
 */
export default interface SurveyModel {
  /**
   * Comentário do usuário acerca de sua experiência na plataforma.
   *
   * Valor padrão: null.
   */
  comment: string;

  /**
   * Nota atribuída pelo usuário à plataforma com base em sua experiência.
   *
   * Nota deve ser inteiro de valor 5 => n >= 1. Atributo not null.
   */
  grade: number;

  /**
   * Indicação de status da pesquisa, se respondida ou não.
   *
   * Valor padrão: false;
   */
  answered?: boolean;
}
