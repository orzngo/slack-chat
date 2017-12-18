import {Bot} from "./bot/Bot";
import * as Config from "config";

declare const process: any;

const bot = new Bot(Config.get("slack.token"));
bot.start();
