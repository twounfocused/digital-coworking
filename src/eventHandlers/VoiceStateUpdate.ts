import { ClientEvents, Events, VoiceState } from "discord.js";
import DiscordClientSingleton from "../services/DiscordClient";
import { DiscordEventHandler } from "../models";
import Environment from "../services/Environment";

type VoiceEvent = "joined" | "left" | "switched"

class VoiceStateUpdateHandler implements DiscordEventHandler<Events.VoiceStateUpdate> {
	public event: keyof ClientEvents = Events.VoiceStateUpdate;

	execute = async (oldState: VoiceState, newState: VoiceState): Promise<void> => {
		
		const {member} = newState;

		const voiceEvent = this.determineVoiceEvent(oldState.channelId, newState.channelId);
	
		if (voiceEvent !== "joined") {
			return;
		}
	
		if (!member) {
			return;
		}
	
		const dmMessage = `Hello ${member.displayName}! What do you want to accomplish in today's work/study session?`;
	
		const dmChannel = await member.createDM();
		dmChannel.send(dmMessage);
	
		const collected = await dmChannel.awaitMessages({
			filter: (message) => {
				return message.author.id === member.id;
			},
			max: 1,
			time: 400000,
		});
	
		const response = collected.first()?.content;
	
		const discordClientService = DiscordClientSingleton?.getInstance();
		const channel = await discordClientService.client?.channels.fetch(Environment.CHANNEL_ID ?? "");
		
		if (channel?.isTextBased()) {
			const currentDate = new Date().toLocaleString("en-US", {dateStyle: "short"});
	
			channel.send({			
				embeds: [
					{
						title: `[${currentDate}]: Session goals are`,
						description: response,
						author: {
							name: member.user.username,
						},
						color: 5763719,
					}
				]
			});
		}
		
		return;
	};

	determineVoiceEvent(oldChannelId: string | null, newChannelId: string | null): VoiceEvent {
		if (oldChannelId && newChannelId) {
			return "left";
		}
	
		if (!oldChannelId && newChannelId) {
			return "joined";
		}
	
		return "switched";
	}
}

export default VoiceStateUpdateHandler;