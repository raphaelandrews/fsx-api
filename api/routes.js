import Router from "@koa/router";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const router = new Router();

const prisma = new PrismaClient();

router.get("/pacientes", async ctx => {
    try {
        const listPaciente = await prisma.pacientes.findMany({})
        ctx.body = listPaciente
    } catch (error) {
        ctx.status = 500
        return
    }
})

router.get("/pacientes/:id", async ctx => {
    const { id } = ctx.params;

    try {
        const listPaciente = await prisma.pacientes.findUnique({
            where: {
                paciente_id: parseInt(id),
            }
        })

        ctx.body = listPaciente
    } catch (error) {
        ctx.status = 500
        return
    }
})

router.post("/pacientes", async ctx => {
    try {
        const paciente = await prisma.pacientes.create({
            data: {
                nome: ctx.request.body.nome,
                email: ctx.request.body.email,
                idade: ctx.request.body.idade,
            }
        })

        ctx.status = 201
        ctx.body = {
            paciente_id: paciente.paciente_id,
            nome: paciente.nome,
            email: paciente.email,
            idade: paciente.idade,
        }
    } catch (error) {
        if (error.meta && !error.meta.target) {
            ctx.status = 422
            ctx.body = "Email ou nome de usuário já existe"
            return
        }
        console.log(error)
        ctx.status = 500
        ctx.body = "Internal error"
    }
})

router.put("/pacientes/:id", async ctx => {
    try {
        const { id } = ctx.params;
        const { nome, email, idade } = ctx.request.body;

        const update = await prisma.pacientes.update({
            where: {
                paciente_id: parseInt(id),
            },
            data: {
                nome,
                email,
                idade,
            }
        })

        ctx.body = (update)
    } catch (error) {
        ctx.status = 500
        ctx.body = "Internal error"
    }
})

router.delete("/pacientes/:id", async ctx => {
    const { id } = ctx.params;

    try {
        const deletePaciente = await prisma.pacientes.delete({
            where: {
                paciente_id: parseInt(id),
            }
        })
        ctx.status = 204
    } catch (error) {
        console.log(error)
        ctx.status = 500
        return
    }
})

router.post("/signup", async ctx => {
    const saltRounds = 10
    const senha = bcrypt.hashSync(ctx.request.body.senha, saltRounds)

    try {
        const psicologo = await prisma.psicologos.create({
            data: {
                nome: ctx.request.body.nome,
                apresentacao: ctx.request.body.apresentacao,
                email: ctx.request.body.email,
                senha
            }
        })

        const acessToken = jwt.sign({
            sub: psicologo.psicologo_id,
        }, process.env.JWT_SECRET, { expiresIn: '24h' })

        ctx.status = 201
        ctx.body = {
            psicologo_id: psicologo.psicologo_id,
            nome: psicologo.nome,
            email: psicologo.email,
            apresentacao: psicologo.apresentacao,
            acessToken
        }
    } catch (error) {
        if (error.meta && !error.meta.target) {
            ctx.status = 422
            ctx.body = "Email ou nome de usuário já existe"
            return
        }
        ctx.status = 500
        ctx.body = "Internal error"
    }
})

router.get('/login', async ctx => {
    const [, token] = ctx.request.headers.authorization.split(" ")
    const [email, plainTextPassword] = Buffer.from(token, "base64").toString().split(":")

    const psicologo = await prisma.psicologos.findUnique({
        where: { email }
    })

    if (!psicologo) {
        ctx.status = 404
        ctx.body = "Usuário não encontrado"
        return
    }

    const passwordMatch = bcrypt.compareSync(plainTextPassword, psicologo.senha)

    if (passwordMatch) {
        const acessToken = jwt.sign({
            sub: psicologo.psicologo_id,
        }, process.env.JWT_SECRET, { expiresIn: '24h' })

        ctx.body = {
            id: psicologo.id,
            nome: psicologo.nome,
            acessToken
        }

        return
    }

    ctx.status = 404
})

router.get("/psicologos", async ctx => {
    try {
        const listPsicologo = await prisma.psicologos.findMany({})
        ctx.body = listPsicologo
    } catch (error) {
        ctx.status = 500
        return
    }
})


router.get("/psicologos/:id", async ctx => {
    const { id } = ctx.params;

    try {
        const listPsicologoId = await prisma.psicologos.findUnique({
            where: {
                psicologo_id: parseInt(id),
            }
        })
        ctx.body = listPsicologoId
    } catch (error) {
        console.log(error)
        ctx.status = 500
        return
    }
})

router.put("/psicologos/:id", async ctx => {
    try {
        const { id } = ctx.params;
        const { nome, email, apresentacao } = ctx.request.body;

        const updatePsicologo = await prisma.psicologos.update({
            where: {
                psicologo_id: parseInt(id),
            },
            data: {
                nome,
                email,
                apresentacao,
            }
        })

        ctx.body = updatePsicologo
    } catch (error) {
        ctx.status = 500
        ctx.body = "Internal error"
    }
})

router.delete("/psicologos/:id", async ctx => {
    const { id } = ctx.params;

    try {
        const deletePsicologo = await prisma.psicologos.delete({
            where: {
                psicologo_id: parseInt(id),
            }
        })
        ctx.status = 204
    } catch (error) {
        console.log(error)
        ctx.status = 500
        return
    }
})

router.get("/atendimentos", async ctx => {
    try {
        const listAtendimentos = await prisma.atendimentos.findMany({})
        ctx.body = listAtendimentos
    } catch (error) {
        ctx.status = 500
        return
    }
})

router.get("/atendimentos/:id", async ctx => {
    const { id } = ctx.params;

    try {
        const listPaciente = await prisma.atendimentos.findUnique({
            where: {
                atendimentos_id: parseInt(id),
            }
        })
        ctx.body = listPaciente
    } catch (error) {
        ctx.status = 500
        return
    }
})

router.post("/atendimentos", async ctx => {
    try {
        const { pacienteId, data_atendimento, observacao } = ctx.request.body;

        const [, token] = ctx.request.headers?.authorization?.split(" ") || []
        const payload = jwt.verify(token, process.env.JWT_SECRET)
       
        const atendimentos = await prisma.atendimentos.create({
            data: {
                pacienteId,
                psicologoId: payload.sub,
                data_atendimento,
                observacao,
            }
        })

        ctx.status = 201
        ctx.body = atendimentos
    } catch (error) {
        console.log(error)
        ctx.status = 500
        ctx.body = "Internal error"
    }
})
