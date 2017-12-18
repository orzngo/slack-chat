export class UI {
    messages: Message[];

    icon = [
        ":heartbeat:",
        ":heartpulse:"
    ];

    iconIndex: number = 0;

    constructor(messages: Message[]) {
        this.update(messages);
    }

    update(messages: Message[]): void {
        this.messages = messages;
    }

    get rendered(): string {
        let content = "---\n";
        for (const i in this.messages) {
            content += "[" + this.messages[i].name + "]： " + this.messages[i].text + "\n";
        }
        content += "---\n" + this.icon[this.iconIndex % 2];
        this.iconIndex++;
        return content;
    }
}

export interface Screen {
    channel: string;
    ts: number;
    ui: UI;
}

export interface Message {
    name: string;
    text: string;
}