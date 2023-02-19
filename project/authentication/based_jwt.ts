import { HmacSHA256 } from 'crypto-js'
import { config }     from 'dotenv'
import base64url      from 'base64url'

config({ path: '../../.env' });

export const genSignature  = (payload: { id: string, exp: number }) => {
    const base64Payload    = base64url.encode(JSON.stringify(payload));
    const secretKey        = process.env.HMAC_SHA256_KEY ?? 'Eu juro solenemente nao fazer nada de bom'
    const HMAC             = HmacSHA256(base64Payload, secretKey);
    return base64Payload + '.' + HMAC;
}

export const isSignatureValid = (signature: string) => {
    const dotIndex       = signature.indexOf('.');
    const base64payload  = signature.substring(0, dotIndex);
    const payload        = JSON.parse(base64url.decode(base64payload));

    console.log(payload);

    if(payload.exp >= Date.now() && genSignature(payload) === signature) {
        return true;
    } else {
        return false;
    }
}