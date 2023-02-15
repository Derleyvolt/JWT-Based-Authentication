import express, { Request, Response } from 'express'
import prisma from './project/util/prismaClient'
import userRouter from './project/user/routes/routes'
import body from 'body-parser'

const app = express();
const port = 3333;

app.use(express.json());
app.use(express.raw());
app.use('/user', userRouter);

app.listen(port, () => {
    console.log(`Server is running is port ${port}`);
});

