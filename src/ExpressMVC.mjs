import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import sassMiddleware from 'node-sass-middleware';
import helmet from 'helmet';
import createError from "http-errors";
import Debug from "debug";
import http from "http";
import winston from "winston";
import consoleFormatter from "winston-console-format";
import pkg from "sequelize";

// Models

const {Sequelize} = pkg;

const __dirname = path.resolve();

export const initialize = async () => {
    let logFileName = "logs/log-" + Date.now() + ".log";
    global.logger = winston.createLogger({
        level: process.env.LOG_LEVEL,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.errors({stack: true}),
            winston.format.splat(),
            winston.format.json()
        ),
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize({all: true}),
                    winston.format.padLevels(),
                    consoleFormatter.consoleFormat({
                        showMeta: true,
                        metaStrip: ["timestamp", "service"],
                        inspectOptions: {
                            depth: Infinity,
                            colors: true,
                            maxArrayLength: Infinity,
                            breakLength: 120,
                            compact: Infinity
                        }
                    })
                )
            })
        ]
    });
    global.sequelize = new Sequelize(process.env.DB_URL, {
        logging: msg => logger.debug(msg)
    });
    app.set("views", path.join(__dirname, "src", "Views"));
    app.set("view engine", "pug");

    app.use(express.json());
    app.use(express.urlencoded({
        extended: false
    }));
    app.use(helmet());
    app.use(cookieParser());
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: Number(process.env.SESSION_COOKIE_MAXAGE)
        }
    }));
    app.use(sassMiddleware({
        src: path.join(__dirname, "public"),
        dest: path.join(__dirname, "public"),
        indentedSyntax: true,
        sourceMap: false
    }));
    app.use(express.static(path.join(__dirname, "public")));
}

export const registerRoute = async (basePath, route) => {
    typeof route === "string" ? app.use(basePath, (await import(route)).router) : app.use(basePath, route);
    global.logger.info(`Route für den Pfad ${basePath} registriert.`);
}

export const start = async () => {
    try {
        await sequelize.authenticate();
        logger.info("Die Verbindung zur Datenbank wurde erfolgreich hergestellt.");

        await import("./Model/ArticleModel.mjs");

        await sequelize.sync();
        logger.info("Die Datenbank und die Modeldaten wurden synchronisiert.");
    } catch (exception) {
        logger.error("Fehler mit der Datenbank: ", exception);
        process.exit(1);
        return;
    }

    app.use((req, res, next) => {
        next(createError(404));
        logger.warn(`Fehler 404 für Pfad ${req.path}`);
    });

    app.use((err, req, res, next) => {
        res.locals.message = err.message;
        res.locals.error = err;
        res.status(err.status || 500);
        res.render("error");
    });
    let port = process.env.PORT;
    app.set('port', port);
    let server = http.createServer(app);
    server.listen(port);
    server.on("error", (err) => {
        if (err.syscall !== "listen") {
            throw err;
        }

        let bind = typeof port === "string"
            ? "Pipe " + port : "Port " + port;

        switch (err.code) {
            case "EACCES":
                global.logger.error(bind + " benötigt erweiterte Rechte.");
                process.exit(1);
                break;
            case "EADDRINUSE":
                global.logger.error(bind + " ist bereits in Verwendung.");
                process.exit(1);
                break;
            default:
                throw err;
        }
    });

    server.on("listening", () => {
        let address = server.address();
        let bind = typeof address === "string"
            ? "Pipe " + address : "Port " + address.port;
        global.logger.info(`Gebunden mit ${bind}`);
    });
}
export const app = express();