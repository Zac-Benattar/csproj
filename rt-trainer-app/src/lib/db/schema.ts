import {
	primaryKey,
	mysqlTable,
	int,
	timestamp,
	varchar,
	tinyint,
	smallint,
	decimal,
	boolean,
	json
} from 'drizzle-orm/mysql-core';
import type { AdapterAccount } from '@auth/core/adapters';
import { relations } from 'drizzle-orm';
import { init } from '@paralleldrive/cuid2';

const shortCUID = init({ length: 12 });

/**
 * Json Data schema
 */

export const airportsJSON = mysqlTable('airport', {
	id: varchar('id', { length: 12 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => shortCUID()),
	json: json('json').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const airspacesJSON = mysqlTable('airspace', {
	id: varchar('id', { length: 12 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => shortCUID()),
	json: json('json').notNull(),
	updatedAt: timestamp('updated_at').defaultNow()
});

/**
 * Route data schema
 */

export const waypoints = mysqlTable('waypoint', {
	id: varchar('id', { length: 12 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => shortCUID()),
	index: smallint('index').notNull(), // Holds the position of the point in the route
	type: tinyint('type').notNull(), // Type of route point e.g. cross between MATZ and ATZ, etc.
	name: varchar('name', { length: 100 }).notNull(),
	description: varchar('description', { length: 2000 }),
	latitude: decimal('latitude', { precision: 10, scale: 8 }).notNull(),
	longitude: decimal('longitude', { precision: 10, scale: 8 }).notNull(),
	routeId: varchar('route_id', { length: 12 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const waypointsRelations = relations(waypoints, ({ one }) => ({
	route: one(routes, { fields: [waypoints.routeId], references: [routes.id] })
}));

export const routes = mysqlTable('route', {
	id: varchar('id', { length: 12 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => shortCUID()),
	name: varchar('name', { length: 100 }).notNull(),
	type: tinyint('type').notNull(),
	description: varchar('description', { length: 2000 }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
	createdBy: varchar('created_by', { length: 255 }).notNull()
});

export const routesRelations = relations(routes, ({ one, many }) => ({
	users: one(users, { fields: [routes.createdBy], references: [users.id] }),
	scenarios: many(scenarios),
	waypoints: many(waypoints)
}));

export const scenarios = mysqlTable('scenario', {
	id: varchar('id', { length: 12 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => shortCUID()),
	name: varchar('name', { length: 100 }).notNull(),
	description: varchar('description', { length: 2000 }),
	route: varchar('route', { length: 12 }).notNull(),
	seed: varchar('seed', { length: 20 })
		.notNull()
		.$defaultFn(() => shortCUID()),
	hasEmergency: boolean('has_emergency').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
	createdBy: varchar('created_by', { length: 255 }).notNull()
});

export const scenariosRelations = relations(scenarios, ({ one }) => ({
	users: one(users, { fields: [scenarios.createdBy], references: [users.id] }),
	routes: one(routes, { fields: [scenarios.route], references: [routes.id] })
}));

/**
 * User tables schema
 */

export const users = mysqlTable('user', {
	id: varchar('id', { length: 255 }).notNull().primaryKey(),
	name: varchar('name', { length: 255 }),
	email: varchar('email', { length: 255 }).notNull(),
	emailVerified: timestamp('emailVerified', { mode: 'date', fsp: 3 }).defaultNow(),
	image: varchar('image', { length: 255 }),
	prefix: varchar('prefix', { length: 20 }).notNull().default('STUDENT'),
	callsign: varchar('callsign', { length: 20 }).notNull().default('G-OFLY'),
	aircraftType: varchar('aircraftType', { length: 30 }).notNull().default('Cessna 172')
});

export const usersRelations = relations(users, ({ many }) => ({
	routes: many(routes),
	accounts: many(accounts),
	sessions: many(sessions)
}));

export const accounts = mysqlTable(
	'account',
	{
		userId: varchar('userId', { length: 255 }).notNull(),
		type: varchar('type', { length: 255 }).$type<AdapterAccount['type']>().notNull(),
		provider: varchar('provider', { length: 255 }).notNull(),
		providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
		refresh_token: varchar('refresh_token', { length: 255 }),
		access_token: varchar('access_token', { length: 255 }),
		expires_at: int('expires_at'),
		token_type: varchar('token_type', { length: 255 }),
		scope: varchar('scope', { length: 255 }),
		id_token: varchar('id_token', { length: 2048 }),
		session_state: varchar('session_state', { length: 255 })
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId]
		})
	})
);

export const accountsRelations = relations(accounts, ({ one }) => ({
	users: one(users, { fields: [accounts.userId], references: [users.id] })
}));

export const sessions = mysqlTable('session', {
	sessionToken: varchar('sessionToken', { length: 255 }).notNull().primaryKey(),
	userId: varchar('userId', { length: 255 }).notNull(),
	expires: timestamp('expires', { mode: 'date' }).notNull()
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	users: one(users, { fields: [sessions.userId], references: [users.id] })
}));

export const verificationTokens = mysqlTable(
	'verificationToken',
	{
		identifier: varchar('identifier', { length: 255 }).notNull(),
		token: varchar('token', { length: 255 }).notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull()
	},
	(vt) => ({
		compoundKey: primaryKey({ columns: [vt.identifier, vt.token] })
	})
);