import prisma                               from '../../util/prismaClient';
import { NextFunction, Request, Response }  from 'express';
import { sha256Salted }                     from '../../authentication/hashing';
import { genSalt }                          from 'bcrypt';
import { config }                           from 'dotenv';

config({ path: '../../../.env' });

export const userCheckCredentials = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, email } = req.body;

    if (username.length < 5 || password.length < 6) {
        res.status(400).send({ message: 'Usename or password is wrong' });
    } else if (!email.match(/^[a-zA-Z0-9]{1,20}@[a-zA-Z]{3,10}.com$/)) {
        res.status(400).send({ message: 'Email is wrong format' });
    } else {
        next();
    }
}

export const createUser = async (username: string, password: string, email: string) => {
    try {
        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: sha256Salted(password, Number(process.env.ROUND_HASH)),
                email:    email
            }
        });

        return newUser;
    } catch (err) {
        return undefined;
    }
}

export const listUsers = async (userID: number | undefined) => {
    if (typeof userID === 'undefined') {
        return await prisma.user.findMany();
    } else {
        return await prisma.user.findMany({
            where: {
                id: userID,
            }
        });
    }
}

const passwordIsValid = (hashedPassword: string, supossedPasword: string) => {
    const salt   = hashedPassword.substring(0, 20);
    const rounds = Number(process.env.ROUND_HASH) ?? 17;
    const hash   = sha256Salted(supossedPasword, rounds, salt);

    return hash === hashedPassword;
}

export const loginUser = async (username: string, password: string) => {
    const userExists = await prisma.user.findUnique({
        where: {
            username: username
        },
        select: {
            password: true
        }
    });

    if(userExists) {
        if(passwordIsValid(userExists.password, password)) {
            
        } else {
            return false;
        }
    } else {
        return false;
    }
}