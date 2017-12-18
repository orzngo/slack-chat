import {RtmClient, WebClient, RTM_EVENTS} from "@slack/client";
import {Thread} from "../models/Thread";
import {Connection} from "../models/Connection";
import {ChatMessage} from "../models/slack/Message";
import {PostMessageResult} from "../models/slack/PostMessageResult";
import {Screen} from "../models/Screen";


export class Bot {

    user: string = "";
    user_id: string = "";

    webClient: any;
    rtmClient: any;

    currentThreads: Thread[] = [];
    currentConnections: { [key: string]: Connection } = {};

    constructor(token: string) {
        this.rtmClient = new RtmClient(token);
        this.webClient = new WebClient(token);

        this.currentThreads[0] = new Thread();
    }

    async start(): Promise<void> {
        const result: any = await this.webClient.auth.test();
        this.user = result.user;
        this.user_id = result.user_id;


        this.rtmClient.on(RTM_EVENTS.MESSAGE, (m: ChatMessage) => {
            this.messageHandler(m);
        });
        this.rtmClient.start();


        setInterval(() => {
            this.tick();
        }, 100);
    }


    async messageHandler(mes: ChatMessage): Promise<void> {
        if (mes.type !== "message") {
            return;
        }

        if (mes.user === this.user_id) {
            return;
        }

        const command = this.parseMessage(mes);

        switch (command.name) {
        case "screen":
            if (!this.currentConnections[mes.user]) {
                await this.say(command.source.channel, "まずはjoin [name]コマンドを使って参加してください");
                return;
            }
            const result = await this.say(command.source.channel, "新規ウィンドウ作成中。数秒待って何も起きない場合は再試行してください");
            if (result.ok) {
                this.currentConnections[mes.user].screen = new Screen(result.channel, result.ts, this.currentThreads[0].content);
            }
            break;
        case "join":
            const now = Date.now();
            const name = (command.option) ? command.option[0] : "無名";
            this.currentConnections[mes.user] = {
                threadId: 0, userId: mes.user, name: name,
                lastMessageSent: now,
                nextUpdate: now + (Math.random() * 3 * 1000)
            };
            await this.say(command.source.channel, "[" + name + "] として参加しました");
            break;
        case "exit":
            if (!this.currentConnections[mes.user]) {
                return;
            }
            delete this.currentConnections[mes.user];
            break;
        case "err":
            break;
        default:
            if (!this.currentConnections[mes.user]) {
                this.say(mes.channel, "Unknown Command [" + command.name + "]");
            } else {
                const con = this.currentConnections[mes.user];
                if (command.option) {
                    this.currentThreads[con.threadId].add({
                        name: con.name,
                        text: command.name + " " + command.option.join(" ")
                    });
                }
            }
            break;
        }
    }

    private async say(channel: string, text: string): Promise<PostMessageResult> {
        return await this.webClient.chat.postMessage(channel, text, {as_user: true});
    }

    parseMessage(message: ChatMessage): Command {
        if (!message.text) {
            return {name: "err", source: message};
        }

        const text = message.text;
        const splitted = text.split(' ');
        // 書式がコマンドではない
        if (splitted.length < 2) {
            return {name: "err", source: message};
        }

        // 自分宛のメンションでなければスルー
        if (splitted[0].indexOf("@" + this.user_id) < 0) {
            return {name: "err", source: message};
        }

        return {name: splitted[1], option: splitted.slice(2), source: message};
    }

    async tick(): Promise<void> {
        const now = Date.now();
        for (const key in this.currentConnections) {
            const con = this.currentConnections[key];

            if (con.nextUpdate < now && con.screen) {
                con.screen.update(this.currentThreads[con.threadId].content);
                const content = con.screen.render();
                con.nextUpdate += 2000;
                this.webClient.chat.update(con.screen.ts, con.screen.channel, content, {as_user: true}).then().catch(console.log);
            }
        }

    }

}


export interface Command {
    name: string;
    option?: string[];
    source: ChatMessage;
}