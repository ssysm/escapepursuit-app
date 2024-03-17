import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
	Str,
} from "@cloudflare/itty-router-openapi";
import getEdgePrisma from 'utils/getEdgePrisma';
import { faker } from '@faker-js/faker';

export class UserCallback extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Users"],
		summary: "Get a single Game by id",
		requestBody: {
			auth0Id: new Str({
				description: "Auth0 Id",
			}),
		},
	};

	async handle(
		request: Request,
		env: any,
		context: any,
		data: Record<string, any>
	) {

        const prisma = getEdgePrisma(env);

		// Retrieve the validated slug
		const { auth0Id } = data.body;

        //do we need this?
        const user = await prisma.user.upsert({
            where: {
                auth0Id,
            },
            update: {},
            create: {
				name: `${faker.word.adjective()}-${faker.word.noun()}`,
				auth0Id,
            }
        });

		return {
			success: true,
			user,
		}
        
	}
}
