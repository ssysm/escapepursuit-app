import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
	Query,
} from "@cloudflare/itty-router-openapi";
import { GameStatus, PrismaClient,Role } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import getEdgePrisma from '../../utils/getEdgePrisma';

export class GameList extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Games"],
		summary: "Get al Games",
		parameters: {
			openOnly: Query(Boolean, {
				description: "Only return open games",
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

        //do we need this?
        const games = await prisma.game.findMany({
            where: {
				status: data.query.openOnly ? GameStatus.CREATED : null,
            },
            include: {
                players: true
            }
        });

        return {
            success: true,
            games,
        };
        
	}
}
