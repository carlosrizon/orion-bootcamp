/**
 * @interface
 * Modelo de objeto contendo data de criação do usuário e data de reaçização da última pesquisa de satisfação associada
 */
export default interface UserAndLastSurveyDates {
  latestSurvey: Date;
  userCreationDate: Date;
}
