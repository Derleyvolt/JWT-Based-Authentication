import { SHA256 } from 'crypto-js/'
import { config } from 'dotenv'

config({ path: '../../.env' });

export const genRandomNumber = (min: number, max: number) => {
    const limit = 2_147_483_647; // primo de mersenne, aka 2^31-1
    const rand  = Math.floor(Math.random() * limit);
    return min + rand % (max-min+1);
}

export const genSalt = (length: number) => {
    const out = [];
    for(let i = 0; i < length; i++) {
        out.push(genRandomNumber(33, 125));
    }

    return String.fromCharCode(...out);
}

export const sha256 = (data: string) => {
    return SHA256(data).toString();
}

export const sha256Salted = (data: string, round?: number | undefined, salt?: string | undefined) => {
    salt      = salt ?? genSalt(Number(process.env.SALT_LENGTH));
    let hash  = sha256(salt+data);
    round     = round ?? 17;

    for(var i = 0; i < round; i++) {
        hash = sha256(salt+hash);
    }

    return salt+hash;
} 