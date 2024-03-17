import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
	Str,
} from "@cloudflare/itty-router-openapi";
import { PrismaClient,Role } from '@prisma/client/edge';
import getEdgePrisma from '../../utils/getEdgePrisma';

export class PlayerJoin extends OpenAPIRoute {

	static schema: OpenAPIRouteSchema = {
		tags: ["Games"],
		summary: "Player join",
		parameters: {
			id: Path(String, {
				description: "game Id",
			}),
		},
		requestBody: {
			player: new Str({ description: "player Id"}),
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
		const { id } = data.params;
        const { player } = data.body;

		// Implement your own object insertion here

		const existPlayer = await prisma.gamePlayer.findFirst({
			where: {
				gameId: id,
				userId: player
			}
		});

		if (existPlayer) {
			return {
				success: false,
				error: "Player already joined"
			};
		}

        const playerJoin = await prisma.game.update({
			where: {
				id,
			},
			data: {
				players: {
					create: [
						{
							user: {
								connect: {
									auth0Id: player
								}
							},
							role: Role.UNKNOWN,
							score: 0,
						}
					],
				}
			},
			include: {
				players: true
			}
		});

		// return the new task
		return {
			success: true,
			playerJoin
		};
	}
}
