import { Request, Response, NextFunction } from 'express'
import { isSignatureValid } from '../authentication/based_jwt'

// list of URLs that don't need to authentication
const ignoreURLs = [ '/user/login', ]

export const checkAuthentication = (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!ignoreURLs.some(e => e == req.originalUrl)) {
            const signature: any = req.headers.authorization?.substring('Bearer '.length);
            if(isSignatureValid(signature)) {
                next();
            } else {
                res.status(400).send({ message: 'Invalid authentication' });
            }
        } else {
            next();
        }
    } catch(err) {
        //console.log(err);
        res.status(400).send()
    }
}