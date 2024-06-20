import { aesGcmDecrypt, aesGcmEncrypt } from "jsr:@crypto/aes-gcm"

export const encrypt = async (data: string, key: string) => {
    return await aesGcmEncrypt(data, key);
}

export const decrypt = async (data: string, key: string) => {
    return await aesGcmDecrypt(data, key);
}