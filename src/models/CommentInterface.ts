export interface CommentsModel {
  /**
   * ID do usuário que está criando o comentário.
   */
  user: number;
  /**
   * Categoria do item (Comics, Series, Events, Stories)
   */
  category: string;

  /**
   * ID do item da categoria selecionada.
   */
  categoryId: number;
  /**
   * Comentário que o usuário está criando.
   */
  comment: string;
}
