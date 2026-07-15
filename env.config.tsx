interface EnvInterface {
    baseUrl: string
};

const env: EnvInterface = {
    baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL!,
};

export { env };