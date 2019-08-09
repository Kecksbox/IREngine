interface KeyPair {
    uuid: string,
    apiKey: string,
}

declare module 'uuid-apikey' {
    export function create(): KeyPair
}