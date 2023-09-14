export default class Cors {
    static config = {
        origin: ["http://localhost:9292"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
}