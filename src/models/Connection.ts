import {Screen} from "./Screen";

export interface Connection {
    threadId: number;
    userId: string;
    name: string;
    screen?: Screen;
    lastMessageSent: number;
    nextUpdate: number;
}