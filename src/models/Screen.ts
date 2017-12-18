import {UI, Message} from "./UI";

export class Screen {
    channel: string;
    ts: string;
    ui: UI;

    constructor(channel: string, ts: string, currentMessage: Message[]) {
        this.channel = channel;
        this.ts = ts;

        this.ui = new UI(currentMessage);
    }

    update(messages: Message[]): void {
        this.ui.update(messages);
    }

    render(): string {
        return this.ui.rendered;
    }
}