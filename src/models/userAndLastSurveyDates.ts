/**
 * @interface
 * Modelo de objeto contendo data de criação do usuário {@link User} e data de realização da última pesquisa de satisfação {@link Survey} associada
 */
export default interface UserAndLastSurveyDates {
  latestSurvey: Date;
  userCreationDate: Date;
}
