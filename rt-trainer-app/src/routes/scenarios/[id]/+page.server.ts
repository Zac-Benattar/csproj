import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { and, eq } from 'drizzle-orm';
import { scenarios, users } from '$lib/db/schema';
import { db } from '$lib/db/db';
import { generateScenario } from '$lib/ts/ScenarioGenerator';
import Waypoint from '$lib/ts/AeronauticalClasses/Waypoint';
import { instanceToPlain } from 'class-transformer';

export const load: PageServerLoad = async (event) => {
	const scenarioId = event.params.id;
	const session = await event.locals.auth();

	let prefix: string | null = null;
	let callsign: string | null = null;
	let aircraftType: string | null = null;

	let userId = '-1';

	if (!session?.user) throw redirect(303, '/login');

	if (session?.user?.email != undefined && session?.user?.email != null) {
		const userRow = await db.query.users.findFirst({
			columns: {
				id: true,
				prefix: true,
				callsign: true,
				aircraftType: true
			},
			where: eq(users.email, session.user.email)
		});

		if (userRow != null || userRow != undefined) {
			userId = userRow.id;
			prefix = userRow.prefix;
			callsign = userRow.callsign;
			aircraftType = userRow.aircraftType;
		}
	}

	const scenarioRow = await db.query.scenarios.findFirst({
		where: and(eq(scenarios.createdBy, userId), eq(scenarios.id, scenarioId)),
		with: {
			routes: {
				with: {
					waypoints: true
				}
			}
		}
	});

	if (scenarioRow == null || scenarioRow == undefined) {
		return {
			error: 'No scenario found'
		};
	}

	const waypointsList: Waypoint[] = scenarioRow.routes.waypoints.map((waypoint) => {
		return new Waypoint(
			waypoint.name,
			[parseFloat(waypoint.long), parseFloat(waypoint.lat)],
			waypoint.type,
			waypoint.index
		);
	});
	waypointsList.sort((a, b) => a.index - b.index);

	const scenario = await generateScenario(
		scenarioId,
		scenarioRow.name,
		scenarioRow.description ?? '',
		scenarioRow.seed,
		waypointsList,
		scenarioRow.hasEmergency
	);

	return {
		scenario: instanceToPlain(scenario),
		aircraftDetails: {
			prefix: prefix,
			callsign: callsign,
			aircraftType: aircraftType
		}
	};
};

/** @type {import('./$types').Actions} */
export const actions = {
	updateScenario: async ({ request }) => {
		const data = await request.formData();
		const scenarioId = data.get('scenarioId')?.toString();
		let scenarioName = data.get('scenarioName');
		if (scenarioName == null || scenarioName == undefined) {
			scenarioName = 'Unnamed Scenario';
		}
		const scenarioDescription = data.get('scenarioDescription')?.toString();
		let scenarioSeed = data.get('scenarioSeed')?.toString();
		if (scenarioSeed == null || scenarioSeed == undefined) {
			scenarioSeed = '0';
		}

		if (scenarioId == null || scenarioId == undefined) {
			return fail(400, { scenarioId: scenarioId, missing: true });
		}

		await db
			.update(scenarios)
			.set({
				name: scenarioName.toString(),
				description: scenarioDescription,
				seed: scenarioSeed
			})
			.where(eq(scenarios.id, scenarioId));
	},

	deleteScenario: async ({ params }) => {
		const scenarioId = params.id;
		if (scenarioId == null || scenarioId == undefined) {
			return fail(400, { scenarioId: scenarioId, missing: true });
		}

		await db.delete(scenarios).where(eq(scenarios.id, scenarioId));

		throw redirect(303, '/myscenarios');
	},

	redirectToSimulator: async ({ params }) => {
		const scenarioId = params.id;
		if (scenarioId == null || scenarioId == undefined) {
			return fail(400, { scenarioId: scenarioId, missing: true });
		}

		throw redirect(303, `/simulator/${scenarioId}`);
	}
};