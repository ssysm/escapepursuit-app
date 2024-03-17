
import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
    Path,
	Str,
    Num
} from "@cloudflare/itty-router-openapi";
import { GameStatus, PrismaClient,Role } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import getEdgePrisma from '../../utils/getEdgePrisma';

export class PlayerScan extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
        tags: ["Games"],
		summary: "Caught Player",
		requestBody: {
			gameId: new Str({ description: "game id"}),
			caughtPlayerGameId: new Num({ description: "caught player id"}),
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
        const { gameId, caughtPlayerGameId } = data.body; // game ID

		// Implement your own object deletion here
		// const updateChaser = await prisma.gamePlayer.update({
        //     where: {
        //         gameId: gameId,
        //         id: decodeURIComponent(caughtPlayerGameId)
        //     },
        //     data: {
        //        role: Role.CHASER
        //     }
		// });

        // Grabs data for all the Hider
        const findHider = await prisma.gamePlayer.findFirst({
            where: {
                gameId: gameId,
                assignNum: parseFloat(caughtPlayerGameId)
            },
            select: {
                role: true
            }
        });

        if (findHider === null) {
            return {
                success: false,
                error: "Player not found"
            };
        }

        const gameDone = await prisma.game.update({
            where: {
                id: gameId
            },
            data:{
                status: GameStatus.FINISHED
            }
        })

		// return the new task
		return {
			success: true,
			findHider,
            gameDone,
		};
	}
}
