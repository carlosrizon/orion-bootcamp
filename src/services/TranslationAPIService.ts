import { Translate } from '@google-cloud/translate/build/src/v2';
import 'dotenv/config';

const [apiKey, projectId] = [
  //Key da API google Translate
  process.env.GOOGLE_TRANSLATE_API_KEY,
  // ID do projeto google Translate
  process.env.GOOGLE_TRANSLATE_PROJECT_ID
];

const translateClient = new Translate({ projectId, key: apiKey });

export default class TranslationAPIService {
  async getTranslation(property, propertyValue) {
    try {
      const [translation] = await translateClient.translate(
        propertyValue,
        'pt'
      );
      return translation;
    } catch (error) {
      console.error(`Não foi possível traduzir ${property}. `, error);
    }
  }
}
