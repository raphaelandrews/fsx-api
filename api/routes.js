import Router from "@koa/router";
import { PrismaClient } from "@prisma/client";

export const router = new Router();

const prisma = new PrismaClient();

router.get("/players-blitz", async ctx => {
    try {
        const listPlayers = await prisma.players.findMany({
            where: {
                active: true,
            },
            orderBy:
            {
                blitz: 'desc',
            },
        });
        ctx.body = listPlayers;
    } catch (error) {
        console.log(error)
        ctx.status = 500
        return
    }
})

router.get("/players-rapid", async ctx => {
    try {
        const listPlayers = await prisma.players.findMany({
            where: {
                active: true,
            },
            orderBy:
            {
                rapid: 'desc',
            },
        });
        ctx.body = listPlayers;
    } catch (error) {
        console.log(error)
        ctx.status = 500
        return
    }
})

router.get("/players-classic", async ctx => {
    try {
        const listPlayers = await prisma.players.findMany({
            where: {
                active: true,
            },
            orderBy:
            {
                classic: 'desc',
            },
        });
        ctx.body = listPlayers;
    } catch (error) {
        console.log(error)
        ctx.status = 500
        return
    }
})

router.get("/top-blitz", async ctx => {
    try {
        const listPlayers = await prisma.players.findMany({
            orderBy: [
                {
                    blitz: 'desc',
                },
            ],
            take: 5,
        });
        ctx.body = listPlayers;
    } catch (error) {
        console.log(error)
        ctx.status = 500
        return
    }
})

router.get("/top-rapid", async ctx => {
    try {
        const listPlayers = await prisma.players.findMany({
            orderBy: [
                {
                    rapid: 'desc',
                },
            ],
            take: 5,
        });
        ctx.body = listPlayers;
    } catch (error) {
        console.log(error)
        ctx.status = 500
        return
    }
})

router.get("/top-classic", async ctx => {
    try {
        const listPlayers = await prisma.players.findMany({
            orderBy: [
                {
                    classic: 'desc',
                },
            ],
            take: 5,
        });
        ctx.body = listPlayers;
    } catch (error) {
        console.log(error)
        ctx.status = 500
        return
    }
})

router.get("/highlights", async ctx => {
    try {
        const listPlayers = await prisma.players.findMany({
            where: {
                player_id: { in: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
            },
        });
        ctx.body = listPlayers;
    } catch (error) {
        console.log(error)
        ctx.status = 500
        return
    }
})

router.get("/players/:id", async ctx => {
    const { id } = ctx.params;

    try {
        const listPlayers = await prisma.players.findUnique({
            where: {
                player_id: parseInt(id),
            },
            include: {
                playerTournaments: true,
            }
        })

        ctx.body = listPlayers;
    } catch (error) {
        console.log(error)
        ctx.status = 500
        return
    }
})

router.post("/players", async ctx => {
    try {
        const players = await prisma.players.create({
            data: {
                name: ctx.request.body.name,
                shortName: ctx.request.body.shortName,
                blitz: ctx.request.body.blitz,
                rapid: ctx.request.body.rapid,
                classic: ctx.request.body.classic,
                title: ctx.request.body.title,
                shortTitle: ctx.request.body.shortTitle,
                city: ctx.request.body.city,
                birthYear: ctx.request.body.birthYear,
                profilePhoto: ctx.request.body.profilePhoto,
                backgroundPhoto: ctx.request.body.backgroundPhoto,
                lichessID: ctx.request.body.lichessID,
                chesscomID: ctx.request.body.chesscomID,
                active: ctx.request.body.active,
            }
        })

        ctx.status = 201
        ctx.body = {
            player_id: players.player_id,
            shortName: players.shortName,
            blitz: players.blitz,
            rapid: players.rapid,
            classic: players.classic,
            title: players.title,
            shortTitle: players.shortTitle,
        }

    } catch (error) {
        if (error.meta && !error.meta.target) {
            ctx.status = 422
            return
        }
        ctx.status = 500
        ctx.body = "Internal error"
    }
})

router.put("/players/:id", async ctx => {
    try {
        const { id } = ctx.params;
        const { name,
            shortName,
            blitz,
            rapid,
            classic,
            title,
            shortTitle,
            city,
            birthYear,
            profilePhoto,
            backgroundPhoto,
            lichessID,
            chesscomID,
            active,
        } = ctx.request.body;

        const update = await prisma.players.update({
            where: {
                player_id: parseInt(id),
            },
            data: {
                name,
                shortName,
                blitz,
                rapid,
                classic,
                title,
                shortTitle,
                city,
                birthYear,
                profilePhoto,
                backgroundPhoto,
                lichessID,
                chesscomID,
                active,
            }
        })

        ctx.body = (update)
    } catch (error) {
        console.log(error)
        ctx.status = 500
        ctx.body = "Internal error"
    }
})
