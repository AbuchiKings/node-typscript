import { cleanEnv, str, port } from "envalid";

export default function validateEnv(): void{
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices:['development', 'production']
        }),
        MONGODB_URI: str(),
        port: port({default: 5000})
    })
}
