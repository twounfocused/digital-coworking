import { Events } from "discord.js";
import { DiscordEventHandler } from "../models";
import VoiceStateUpdateHandler from "./VoiceStateUpdate";

type AvailableEvents = Events.VoiceStateUpdate
type AvailableEventHandlers = Record<AvailableEvents, DiscordEventHandler<AvailableEvents>>;

export default {
	[Events.VoiceStateUpdate]: new VoiceStateUpdateHandler(), 
} as AvailableEventHandlers;

