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
        const players= await prisma.players.create({
            data: {
                name: ctx.request.body.name,
                blitz: ctx.request.body.blitz,
                rapid: ctx.request.body.rapid,
                classic: ctx.request.body.classic,
            }
        })

        ctx.status = 201
        ctx.body = {
            player_id: players.player_id,
            name: players.name,
            blitz: players.blitz,
            rapid: players.rapid,
            classic: players.classic
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
        const { name, blitz, rapid, classic } = ctx.request.body;

        const update = await prisma.players.update({
            where: {
                player_id: parseInt(id),
            },
            data: {
                name,
                blitz,
                rapid,
                classic,
            }
        })

        ctx.body = (update)
    } catch (error) {
        console.logo(error)
        ctx.status = 500
        ctx.body = "Internal error"
    }
})
