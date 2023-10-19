import { DataSource } from 'typeorm';

// @See https://typeorm.io/#creating-a-new-datasource

export const database = new DataSource({
  name: 'default',
  type: 'mysql',
  database: process.env.DB_DATABASE,
  url: process.env.DB_CONNECTION_STRING,
  entities: ['src/entity/*.ts', 'entity/*.js'],
  logging: true,
  synchronize: true
});
