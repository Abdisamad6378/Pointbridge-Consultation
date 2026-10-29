// Entry point for the TypeORM CLI only (it runs outside Nest, so ConfigModule is unavailable).
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { buildDataSourceOptions } from './database.options.js';

export default new DataSource(buildDataSourceOptions(process.env));
