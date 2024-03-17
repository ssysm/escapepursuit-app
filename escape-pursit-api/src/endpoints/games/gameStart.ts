import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
    Path,
    Str,
} from "@cloudflare/itty-router-openapi";
import { faker } from '@faker-js/faker';
import { GameStatus,Role } from '@prisma/client/edge';
import getEdgePrisma from 'utils/getEdgePrisma';

export class GameStart extends OpenAPIRoute {
	static schema: OpenAPIRouteSchema = {
		tags: ["Games"],
		summary: "Game Start",
        parameters: {
			id: Path(String, {
				description: "game Id",
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
		// Implement your own object fetch here
        const { id } = data.params; // game ID

        const game = await prisma.game.findFirst({
            where: {
                id: id,
            },
            select: {
                players: {
                    select: {
                        id: true
                    }
                }
            }
        });

        const users = game.players.map((player) => player.id);

        // Select a random id from dic
        var rando = users[Math.floor(Math.random() * Object.keys(users).length)];

        // // Change that selected random user to Chaser
        const updateChaser = await prisma.game.update({
            where: {
                id,
            },
            data: {
                players: {
                    updateMany: {
                        where: {
                            gameId: id,
                        },
                        data: {
                            role: Role.CHASER
                        }
                    }
                },
                status: GameStatus.STARTED
            }
		});

        const updateUser = await prisma.game.update({
            where: {
                id,
            },
            data: {
                players: {
                    updateMany: {
                        where: {
                            gameId: id,
                            id: rando
                        },
                        data: {
                            role: Role.RUNNER,
                            assignNum: faker.number.int({
                                min: 10,
                                max: 100
                            })
                        }
                    }
                },
            }
		});
        
        return {
            success: true,
            updateUser,
            updateChaser,
        };

    }

};
