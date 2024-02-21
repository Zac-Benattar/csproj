import 'dotenv/config';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

// create the connection
const connection = connect({
	host: env.DATABASE_HOST,
	username: env.DEV_DATABASE_USERNAME,
	password: env.DEV_DATABASE_PASSWORD
});

export const db = drizzle(connection, { schema });