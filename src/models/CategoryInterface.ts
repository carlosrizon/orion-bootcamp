// interface das categorias Character, Serie, Comic, Event e Storie
export default interface CategoryModel {
  idMarvel: number;
  enName?: string;
  ptName?: string;
  enTitle?: string;
  ptTitle?: string;
  description: string;
  thumb: string;
  isTranslated: boolean;
}
