import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
	Str,
} from "@cloudflare/itty-router-openapi";
import getEdgePrisma from '../../utils/getEdgePrisma';

export class PlayerLeave extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Games"],
		summary: "Delete leaving player",
		parameters: {
			gameId: Path(String, {
				description: "game id",
			}),
			playerId: Path(String, {
				description: "player id",
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

		const { gameId, playerId } = data.params;

		// Implement your own object insertion here

        const playerLeave = await prisma.gamePlayer.findFirst({
			where: {
				gameId: gameId,
				userId: decodeURIComponent(playerId),
			}
		});

		if (!playerLeave) {
			return {
				success: false,
				error: "Player not found"
			};
		}

		const deletePlayer = await prisma.game.update({
			where: {
				id: gameId,
			},
			data: {
				players: {
					delete: {
						id: playerLeave.id
					}
				}
			}
		});

		// Return the deleted task for confirmation
		// return the new task
		return {
			success: true,
			playerLeave,
			deletePlayer
		};
	}
}
