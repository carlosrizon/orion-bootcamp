/**
 * @interface
 * Modelo de objeto dos tipos possíveis de ambientes de execução da aplicação
 */
export default interface RunEnvironmentsModel {
  /** Ambiente de desenvolvimento */
  DEV: string;

  /** Ambiente de produção */
  PROD: string;
}
