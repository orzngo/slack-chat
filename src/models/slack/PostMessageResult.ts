import {ChatMessage} from "./Message";

export interface PostMessageResult {
    ok: boolean;
    channel: string;
    ts: string;
    message: ChatMessage;
    scopes: string[];
    acceptedScopes: string[];
}