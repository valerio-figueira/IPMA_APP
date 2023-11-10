import Server from "./server";

const PORT_HTTPS = 9090;
const PORT_HTTP = 9292;

const server = new Server(PORT_HTTP, PORT_HTTPS);

server.start();