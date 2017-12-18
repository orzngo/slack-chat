export interface ChatMessage {
    type: string;
    channel: string;
    user: string;
    text: string;
    ts: string;
    source_team: string;
    team: string;
}