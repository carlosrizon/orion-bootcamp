import { MysqlDataSource } from '../config/database';
import Artist from '../entity/Artist';

import { sheets } from '@googleapis/sheets';

/**
 * Função que remove todas as entradas da tabela de artistas, para fins de atualização.
 */
async function clearArtistsTable() {
  try {
    const artistsRepository = MysqlDataSource.getRepository(Artist);

    const allArtists: Artist[] = await artistsRepository.find();

    for (const artist of allArtists) {
      await artistsRepository.remove(artist);
    }
  } catch (error) {
    console.log('Erro ao tentar limpar a tabela de artistas: ', error);
  }
}

/**
 * Classe relacionada a obtenção dos dados de artistas de uma planilha para o banco
 */
export default class GetArtistsSheetToDatabase {
  /**
   * Método que faz uso da API do Google Sheets e salva no banco as informações de artistas de uma planilha
   */
  async getSheetToDatabase() {
    try {
      const responsesSheet = sheets({ version: 'v4' });

      //range pega todas as linhas a partir da segunda, até a coluna J
      const res = await responsesSheet.spreadsheets.values.get({
        spreadsheetId: process.env.ARTISTS_SPREADSHEET_ID,
        range: 'Form Responses 1!A2:K',
        key: process.env.GOOGLE_SHEET_API_KEY
      });

      console.log('Obtendo linhas da planilha de artistas para o banco...');
      await clearArtistsTable();

      const values = res.data.values;
      let length: number;
      //para cada linha da planilha
      for (const row of values) {
        length = row.length;

        //a coluna 11 representa se o artista foi aprovado ou nao
        if (length == 11) {
          //gravar artista aprovado no banco de dados
          if (Number(row[10]) == 1) {
            //pega repositorio
            const artistsRepository = MysqlDataSource.getRepository(Artist);

            //cria objeto para gravar no banco
            const artist = new Artist();

            artist.email = row[1].toLowerCase();
            artist.fullName = row[2];
            artist.artSampleURL = row[8];

            //salva objeto no banco
            artistsRepository.save(artist);
          }
        }
      }
    } catch (error) {
      console.log('Erro no job de atualizar a tabela de artistas: ', error);
    }
  }
}
