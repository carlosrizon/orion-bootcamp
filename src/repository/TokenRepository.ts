import { Repository } from 'typeorm';
import { Token } from '../entity/Token';

/**
 * Classe que implementa manipulação e busca de status de uso de token do usuário
 */
export class TokenRepository extends Repository<Token> {
  async findUnusedTokenByUserIdAndToken(
    userId: number,
    token: string
  ): Promise<Token | undefined> {
    return this.findOne({
      where: {
        user: { id: userId },
        token: token,
        isUsed: true
      }
    });
  }
}
