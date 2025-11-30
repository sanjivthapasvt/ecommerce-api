import { DataSource } from "typeorm";
import { join } from "path";
import { config } from './environmentVariables';

// console.log(config.database);

const AppDataSource = new DataSource({
  type: "postgres",
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: true,
  // logging: config.nodeEnv === 'development',
  logging: false,
  entities: ["src/features/**/models/*.model.ts"],
  migrations: [join(__dirname, "../migrations/*.{ts,js}")],
  migrationsRun: false,
  migrationsTableName: "migrations",
  ssl: config.nodeEnv !== 'development' ? { rejectUnauthorized: false } : false
});

export const connectDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
};

export default AppDataSource;
