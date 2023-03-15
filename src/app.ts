import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import mongoose, { ConnectOptions } from 'mongoose';
import morgan from 'morgan';

import Controller from '@/utils/interfaces/controller.interfaces';
import ErrorMiddleware from '@/middleware/error.middleware';

class App {
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;
        this.initializeDatabaseConnection();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    private initializeMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(helmet());
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }))
        this.express.use(compression())
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.express.use('/api', controller.router);
        })
    }

    private initializeErrorHandling(): void {
        this.express.use(ErrorMiddleware)
    }

    private initializeDatabaseConnection(): void {
        const MONGODB_URI = process.env.MONGODB_URI || ''
        mongoose
            .connect(MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                maxPoolSize: 15,
                socketTimeoutMS: 45000,
                useCreateIndex: true,
                useFindAndModify: false,
            } as ConnectOptions)
            .then(async (con) => {
                // eslint-disable-next-line
                console.log(`Connected to ${con.connections[0].name} Database successfully`);
            })
            .catch((error) => {
                return console.log(error); // eslint-disable-line
            });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose default connection disconnected'); // eslint-disable-line
        });

        mongoose.connection.on('error', (error) => {
            console.log('Mongoose default connection error: ' + error); // eslint-disable-line
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            process.exit(0);
        });
    }

    public listen(): void{
        this.express.listen(this.port, () => {
            console.log(`\n✔ Server is listening on port ${this.port} on: `); // eslint-disable-line
            console.log(`  localhost: http://localhost:${this.port}`); // eslint-disable-line
        })
    }
}

export default App;