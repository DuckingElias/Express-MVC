import dotenv from 'dotenv';
import winston from 'winston';
import consoleFormatter from "winston-console-format";
import * as application from "./src/ExpressMVC.mjs";

const main = async () => {
    dotenv.config();
    await application.initialize();
    await application.registerRoute("/", "./Routes/IndexRoute.mjs");
    await application.registerRoute("/edit", "./Routes/EditArticleRoute.mjs");
    await application.start();
}

(async () => await main())();