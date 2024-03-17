import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Str,
} from "@cloudflare/itty-router-openapi";
import { PrismaClient,Role } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import getEdgePrisma from '../../utils/getEdgePrisma';

export class GameCreate extends OpenAPIRoute {

	static schema: OpenAPIRouteSchema = {
		tags: ["Games"],
		summary: "Create a Game",
		requestBody: {
			name: new Str({ example: "New Chase Game" }),
			hostId: new Str({ example: "123", description: "The auth0 id of the host"}),
		},
	};

	async handle(
		request: Request,
		env: any,
		context: any,
		data: Record<string, any>
	) {

		const prisma = getEdgePrisma(env);

		// Retrieve the validated request body
		const gameToCreate = data.body;

		// Implement your own object insertion here

        const game = await prisma.game.create({
            data: {
                name: gameToCreate.name,
                hostId: gameToCreate.hostId,
                players: {
                    create: [
                        {
                            user: {
								connect: {
									auth0Id: gameToCreate.hostId
								}
							},
                            role: Role.UNKNOWN,
                            score: 0,
                        }
                    ]
                }
            }
        });

		// return the new task
		return {
			success: true,
			game
		};
	}
}
