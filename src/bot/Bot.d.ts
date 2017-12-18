export declare class Bot {
    user: string;
    user_id: string;
    webClient: any;
    rtmClient: any;
    constructor(token: string);
    start(): Promise<void>;
    messageHandler(mes: ChatMessage): void;
}
export interface RTMMessage {
    type: string;
}
export interface ChatMessage extends RTMMessage {
    channel: string;
    user: string;
    text: string;
    ts: string;
}
