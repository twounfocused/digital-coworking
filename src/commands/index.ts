import SlashCommand from "../models/SlashCommand";
import PingCommand from "./Ping";

export type AvailableCommands = "ping"
type AvailableSlashCommands = Record<AvailableCommands, SlashCommand>

const ping = new PingCommand();

export default { 
	ping,
} as AvailableSlashCommands;