const Discord = require('discord.js');
const fs  = require('fs');
var config = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();


client.login(config.token);

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}


client.on('message' , message => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  try {
		command.execute(message, args);
	}
  catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});
