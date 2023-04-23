import { ClientEvents } from "discord.js";

abstract class DiscordEventHandler<K extends keyof ClientEvents> {
  abstract event: keyof ClientEvents;

  abstract execute(...args: ClientEvents[K]): Promise<void>;
}

export default DiscordEventHandler;