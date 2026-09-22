import path from "node:path";
import { pathToFileURL } from "node:url";

let socketModule = null;
let socketPromise = null;

export async function getSocket() {
  if (socketModule) return socketModule;

  if (!socketPromise) {
    const socketPath = path.join(process.cwd(), "socket.js");
    const socketUrl = pathToFileURL(socketPath).href;

    socketPromise = import(socketUrl);
  }

  socketModule = await socketPromise;
  return socketModule;
}

export async function startBot() {
  const socket = await getSocket();

  if (typeof socket.startBot === "function") {
    return await socket.startBot();
  }

  if (typeof socket.default === "function") {
    return await socket.default();
  }

  return socket;
}

export default {
  getSocket,
  startBot
};
