// commentValidator.ts

import fs from 'fs';

/**
 * Filtra as palavras inseridas pelo usuário. Não permite que o usuário crie um comentário utilizando
 * palavras impróprias.
 */
export class CommentValidator {
  /**
   *
   * @returns Retorna as palavras impróprias.
   */
  static getBannedWords(): string[] {
    try {
      const content = fs.readFileSync(
        '/app/src/validator/bannedWords.txt',
        'utf-8'
      );
      return content.split('\n');
    } catch (error) {
      console.error('Erro na leitura do arquivo de palavras proibidas.');
    }
  }

  /**
   *
   * @param comment Comentário do usuário
   * @param bannedWords Lista de palavras impróprias
   * @returns Retorna true caso o comentário contenha palavras impróprias
   */
  static containsBannedWords(comment: string, bannedWords: string[]): boolean {
    const sanitizedComment = comment.replace(/[^\w\s]/gi, '').toLowerCase();
    return bannedWords.some((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(sanitizedComment);
    });
  }
}
