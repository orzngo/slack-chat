import {Message} from "./UI";

export class Thread {
    MAX_LENGTH = 10;

    content: Message[];

    constructor() {
        this.content = [];
    }

    add(message: Message): void {
        this.content.push(message);
        if (this.content.length > this.MAX_LENGTH) {
            this.content.shift();
        }
    }
}