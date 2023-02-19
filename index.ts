import express, { Request, Response } from 'express'
import userRouter from './project/user/routes/routes'
import { checkAuthentication } from './project/authMiddleware/auth';

const app = express();
const port = 3333;

app.use(express.json());
app.use(express.raw());
app.use(checkAuthentication);
app.use('/user', userRouter);

app.listen(port, () => {
    console.log(`Server is running is port ${port}`);
});

