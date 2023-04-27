import { Client, Events, GatewayIntentBits } from "discord.js";
import Commands, { AvailableCommands } from "../commands";
import Environment from "./Environment";
import EventHandlers from "../eventHandlers";


class DiscordClientSingleton {
	private static instance: DiscordClientSingleton;
	private availableSlashCommands = Object.values(Commands);
	private availableEventHandlers = Object.values(EventHandlers);

	public client?: Client<true>;

	private constructor() {
		// Adding private to constructor prevents class from being defined using `new` 
		// Use `DiscordClientSingleton.getInstance()` instead
	}

	public static getInstance(): DiscordClientSingleton {
		if (!DiscordClientSingleton.instance) {
			DiscordClientSingleton.instance = new DiscordClientSingleton();
		}

		return DiscordClientSingleton.instance;
	}

	public initializeAndListenToCommands() {
		const unreadyClient = new Client({intents: [
			GatewayIntentBits.GuildVoiceStates, 
			GatewayIntentBits.DirectMessages,
		]});

		unreadyClient.once(Events.ClientReady, (readyClient: Client<true>) => {
			this.client = readyClient;
			
			this.initializeSlashCommands();
			this.listenToSlashCommands();
			this.listenToVoiceChannelEvents();
			
			process.stderr.write("discord bot started!");
		});

		unreadyClient.login(Environment.TOKEN);
	}

	private initializeSlashCommands(): void {
		const slashCommands = this.availableSlashCommands.map(command => command.init());
		this.client?.application.commands.set(slashCommands);

		return;
	}

	private listenToSlashCommands(): void {
		this.client?.on(Events.InteractionCreate, async (interaction) => {
			if (!interaction.isChatInputCommand()) {
				return;
			}	
			const commandName = interaction.command?.name as AvailableCommands;

			if (!Commands[commandName]) {
				console.log("command does not exist!");
				return;
			}

			Commands[commandName].execute(interaction);
		});
	}

	private listenToVoiceChannelEvents(): void {
		this.availableEventHandlers.forEach((eventHandler) => {
			this.client?.on(eventHandler.event, eventHandler.execute as any);
		});
	}
}

export default DiscordClientSingleton;