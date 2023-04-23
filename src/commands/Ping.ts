import { CacheType, ChatInputCommandInteraction } from "discord.js";
import SlashCommand from "../models/SlashCommand";

class PingCommand extends SlashCommand {
	name = "ping";
	description = "gets the server ping in ms";

	async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
		const started = new Date().getTime();
		const ended = new Date().getTime();	
		const milliseconds = ended - started;

		await interaction.reply({content: `${milliseconds}ms`, ephemeral: true});
		return;
	}
}

export default PingCommand;