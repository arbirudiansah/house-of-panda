import { createContext } from './context';
import { appRouter } from './routers/_app';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import http from 'http';
import next from 'next';
import { parse } from 'url';
import ws from 'ws';
import dotenv from 'dotenv';
import { a3 } from "../../utils";

dotenv.config({ path: '.env' });

const dev = process.env.NODE_ENV !== 'production';

const createWebSocketServer = (options: ws.ServerOptions) => {
    const wss = new ws.Server({ ...options });
    wss.on('listening', () => {
        console.log(`🚀 WebSocket server ready`);
    });

    wss.on('connection', (ws) => {
        console.log(`🔛 Connection (${wss.clients.size})`);
        ws.once('close', () => {
            console.log(`🔚 Connection (${wss.clients.size})`);
        });
    });

    const handler = applyWSSHandler({ wss, router: appRouter, createContext });

    process.on('SIGTERM', () => {
        console.log('SIGTERM');
        handler.broadcastReconnectNotification();
    });
}

if (dev) {
    createWebSocketServer({ port: 3001 })
} else {
    const port = parseInt(process.env.PORT || '8080', 10);
    const app = next({ dev, port, hostname: '127.0.0.1' });
    const handle = app.getRequestHandler();

    void app.prepare().then(() => {
        const adminKey = process.env.ADMIN_KEY

        if (!process.env.PASSWORD && !a3(adminKey, process.env.PASSWORD)) {
            console.error('Error: Wrong password')
            process.exit(1)
        }

        const server = http.createServer((req, res) => {
            const parsedUrl = parse(req.url!, true);
            void handle(req, res, parsedUrl);
        });

        createWebSocketServer({ server });

        server.listen(port);

        console.log(
            `> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV
            }`,
        );
    }).catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
    });
}