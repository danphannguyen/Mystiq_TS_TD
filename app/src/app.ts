import express from 'express';
import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import * as path from 'path';

import MystiqEngine, { NodeQuestion, NodeResponse, INodeMethods } from './mystiq';

// Create an instance of Express
const app = express();

// Serving public directory
app.use(express.static(path.join(__dirname,'public')));

// Set up HTTP server with Express
const httpServer: HttpServer = new HttpServer(app);

// Set up Socket.io server
const io: SocketIOServer = new SocketIOServer(httpServer);

type TChoiceMessage = {
    choice: boolean;
    questionId: string;
}

// Define types for socket events
interface ServerToClientEvents {
    question: ({id, question}: {id: string, question: string}) => void;
    newQuestionPossibility: () => void;
}

interface ClientToServerEvents {
    messageFromClient: (message: string) => void;
    choice: ({ choice, questionId }: TChoiceMessage) => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    username: string;
}

let onlySocket: boolean = false;

type TSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

// Set up the Socket.io connection
io.on('connection', (socket: TSocket): void => {
    
    if( onlySocket ){
        return ;
    }

    onlySocket = true;
    
    socket.on('choice', async ({ choice, questionId }) => applyChoice(questionId, choice, socket ) );

    socket.on('disconnect', (): void => {
        // console.log(`Front-end disconnected: ${socket.id}`);
        onlySocket = false;
    });
}); ////

async function applyChoice(questionId: string, choice: boolean, socket: TSocket){
    
    let toSend: INodeMethods | null = await MystiqEngine({
        questionId,
        choice
    });

    if( toSend === null ) {
        throw Error(`Grosse erreur !`);
    }

    socket.emit('question', {
        id: toSend?.getId(),
        question: toSend?.getMessage()
    });
}

// Start the server
const PORT: number = 1337;

httpServer.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
