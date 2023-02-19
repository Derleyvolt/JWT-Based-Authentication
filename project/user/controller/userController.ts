import prisma                               from '../../util/prismaClient';
import { NextFunction, Request, Response }  from 'express';
import { sha256Salted }                     from '../../authentication/hashing';
import { config }                           from 'dotenv';
import * as auth                            from '../../authentication/based_jwt';

config({ path: '../../../.env' });

enum ExpirationTime {
    oneDay     = 1000 * 60 * 60 * 24,
    oneMinute  = 1000 * 60,
    oneSecond  = 1000,
}

const passwordIsValid = (hashedPassword: string, supossedPasword: string) => {
    const lenHex = Number(process.env.SALT_LENGTH) ?? 40;
    const salt   = hashedPassword.substring(0, lenHex*2);
    const rounds = Number(process.env.ROUND_HASH) ?? 17;
    const hash   = sha256Salted(supossedPasword, rounds, salt);

    return hash === hashedPassword;
}

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
            const expTime   = Date.now() + ExpirationTime.oneMinute * Math.floor(Math.random() * 5 + 1);
            console.log(expTime);
            const signature = auth.genSignature({id: username, exp: expTime});
            return signature;
        } else {
            return false;
        }
    } else {
        return false;
    }
}