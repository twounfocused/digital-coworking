import * as dotenv from "dotenv";
dotenv.config();

import DiscordClientSingleton from "./services/DiscordClient";

const discordClient = DiscordClientSingleton.getInstance();

discordClient.initializeAndListenToCommands();