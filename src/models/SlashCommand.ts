import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

abstract class SlashCommand {
	abstract name: string;
	abstract description: string;

	init(): SlashCommandBuilder {
		return new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description);
	}


	abstract execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void>;
}

export default SlashCommand;