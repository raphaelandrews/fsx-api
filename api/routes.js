import Router from "@koa/router";
import { PrismaClient } from "@prisma/client";

export const router = new Router();

const prisma = new PrismaClient();

router.get("/players", async ctx => {
    try {
        const listPlayers = await prisma.players.findMany()
        ctx.body = listPlayers
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
            }
        })

        ctx.body = listPlayers
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
            }
        })

        ctx.status = 201
        ctx.body = {
            player_id: players.player_id,
            name: players.name,
            shortName: players.shortName,
            blitz: players.blitz,
            rapid: players.rapid,
            classic: players.classic,
            title: players.title,
            shortTitle: players.shortTitle,
            city: players.city,
            birthYear: players.birthYear,
            profilePhoto: players.profilePhoto,
            backgroundPhoto: players.backgroundPhoto,
            lichessID: players.lichessID,
            chesscomID: players.chesscomID,
            createdAt: players.createdAt,
            updatedAt: players.updatedAt,
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
            }
        })

        ctx.body = (update)
    } catch (error) {
        console.logo(error)
        ctx.status = 500
        ctx.body = "Internal error"
    }
})
