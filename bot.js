const fs = require("fs");

const { 
	tokenofclient, 
	idofclient, 
	idofguild, 
	prefix 
} = require("./config.json");

const {
	Client,
	Collection,
	GatewayIntentBits,
	Partials,
} = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Channel],
});

client.commands = new Collection();
client.slashCommands = new Collection();
client.buttonCommands = new Collection();
client.selectCommands = new Collection();
client.contextCommands = new Collection();
client.modalCommands = new Collection();
client.cooldowns = new Collection();
client.autocompleteInteractions = new Collection();
client.triggers = new Collection();

const rest = new REST({ version: "9" }).setToken(tokenofclient);

const commandJsonData = [
	...Array.from(client.slashCommands.values()).map((c) => c.data.toJSON()),
	...Array.from(client.contextCommands.values()).map((c) => c.data),
];

(async () => {
	try {
		console.log("Started Refereshing application commands");

		await rest.put(
		Routes.applicationGuildCommands(idofclient, idofguild),
			{ body: commandJsonData }
		);

		console.log("Reloaded application commands");
	} catch (error) {
		console.error(error);
	}
})();

client.login(tokenofclient)
