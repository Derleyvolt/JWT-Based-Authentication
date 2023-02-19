import { SHA256 } from 'crypto-js/'
import { config } from 'dotenv'

config({ path: '../../.env' });

export const genRandomNumber = (min: number, max: number) => {
    const limit = 2_147_483_647; // primo de mersenne, aka 2^31-1
    const rand  = Math.floor(Math.random() * limit);
    return min + rand % (max-min+1);
}

const hexFormat = (numbers: number[]) => {
    const hex = [];

    for(var e of numbers) {
        const lsNibble = 0xF   & e;
        const msNibble = (0xF0 & e) >> 4;
        hex.push(msNibble.toString(16) + lsNibble.toString(16));
    }

    return hex.join('');
}

export const genSalt = (length: number) => {
    const out = [];
    for(let i = 0; i < length; i++) {
        out.push(genRandomNumber(0, 255));
    }

    return hexFormat(out);
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