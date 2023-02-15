import express, { Request, Response } from 'express'
import * as user from '../controller/userController'

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
    
});

router.post('/create', user.userCheckCredentials, async (req: Request, res: Response) => {
    const { username, password, email } = req.body;

    const newUser = await user.createUser(username, password, email);

    if(newUser) {
        res.status(200).send(newUser);
    } else {
        res.status(400).send();
    }
});

router.get('/list', async (req: Request, res: Response) => {
    res.status(200).send(await user.listUsers(req.body.userID));
});

export default router;