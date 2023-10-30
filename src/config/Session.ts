import dotenv from "dotenv";
dotenv.config();

export default class Session {
    static config = {
        secret: `${process.env.SESSION_SECRET}`,
        resave: false,
        saveUninitialized: false,
        cookie: { sameSite: true, secure: true }
    }
}