import { Repository } from 'typeorm';
import { Token } from '../entity/Token';

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
