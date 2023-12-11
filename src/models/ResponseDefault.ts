/**
 * Modelo de objeto de resposta padrão às requisições à aplicação
 */
export default interface ResponseDefault {
  /** Data de envio da resposta à requisição */
  date: Date;

  /** Status do processamento da requisição */
  status: boolean;

  /** Dado de retorno */
  data: string | number | undefined;
}
