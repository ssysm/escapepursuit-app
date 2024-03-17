import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { createCors } from 'itty-router';

import { GameCreate } from 'endpoints/games/gameCreate';
import { GameFetch } from 'endpoints/games/gameFetch';
import { GameList } from 'endpoints/games/gameList';
import { GameStart } from 'endpoints/games/gameStart';
import { PlayerJoin } from 'endpoints/games/playerJoin';
import { PlayerLeave } from 'endpoints/games/playerLeave';
import { PlayerScan } from 'endpoints/games/playerScan';
import { UserCallback } from 'endpoints/users/userCallback';

export const router = OpenAPIRouter({
	docs_url: "/",
});

const { preflight, corsify } = createCors();


router.all('*', preflight);

router.post('/api/games', GameCreate);
router.get('/api/games', GameList);
router.get('/api/games/:id', GameFetch);
router.post('/api/games/:id', GameStart);
router.post('/api/games/:id/players', PlayerJoin);
router.post('/api/games/:gameId/players/:caughtPlayerGameId/players', PlayerScan);
router.post('/api/games/:gameId/players/:playerId', PlayerLeave);

router.post('/api/users/callback', UserCallback);

// 404 for everything else
router.all("*", () =>
	Response.json(
		{
			success: false,
			error: "Route not found",
		},
		{ status: 404 }
	)
);

export default {
	fetch: async (request, env, ctx) => {
		return router.handle(request, env, ctx).then(corsify)
	 },
};
