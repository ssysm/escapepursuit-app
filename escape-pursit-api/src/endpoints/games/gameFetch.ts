import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";
import { PrismaClient,Role } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import getEdgePrisma from 'utils/getEdgePrisma';

export class GameFetch extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Games"],
		summary: "Get a single Game by id",
		parameters: {
			id: Path(String, {
				description: "game id",
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
		const { id } = data.params;

        //do we need this?
        const game = await prisma.game.findUnique({
            where: {
                id: id,
            },
            include: {
                players: {
                    include: {
                        user: true
                    }
                }
            }
        });

        // @ts-ignore: check if the object exists
        if (game === null) {
            return Response.json(
                {
                    success: false,
                    error: "Object not found",
                },
                {
                    status: 404,
                }
            );
        }

        return {
            success: true,
            game,
        };
        
	}
}
