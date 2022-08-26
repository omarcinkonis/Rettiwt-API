// PACKAGE LIBS
import mongoose from "mongoose";

// CUSTOM LIBS
import { mongodb_urls } from '../config/urls';
import { Log } from '../data/models/Logs';

/**
 * @summary The interface used to inject the necessary Logging service into the requiring service
 */
export interface Logger {
    // MEMBER METHODS
    log(data: any): Promise<boolean>;                                                       // To log the given data into the database  
}

/**
 * @summary Manages logging of various activities of the api and other logging tasks
 */
export class LogService implements Logger {
    // MEMBER DATA
    private static instance: LogService;                                                    // To store the only instance of the class
    private connUrl: string;                                                                // To store the connection string url to the database
    
    // MEMBER METHODS
    private constructor() {
        this.connUrl = mongodb_urls.logs_url();
    }
    
    /**
     * @summary Initializes all async data
     */
    private async init() {
        await mongoose.connect(this.connUrl);
    }

    /**
     * @returns The only instance of the class
     */
    static async getInstance(): Promise<LogService> {
        // If an instance does not exist already
        if(!this.instance) {
            // Creating a new instance
            this.instance = new LogService();

            // Initializing async data
            await this.instance.init();
        }

        return this.instance;
    }

    /**
     * @summary Logs the given data into the logs database
     * @param data The data to be logged
     */
    public async log(data: any) {
        await new Log({
            time: new Date(),
            data: data
        }).save();

        return true;
    }
}