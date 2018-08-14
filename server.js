"use strict";

/* =============================================
*                   Imports
================================================*/

/**
 * Dotenv Initial configuration.
 */
require("dotenv").config();

/**
 * APi keys and env variables for the Discord bot.
 */
const { DISCORD, PREFIX } = process.env;

/**
 * Time in milliseconds for the timeout cycle.
 * Right now is 30.000 or 30 secs
 */
const time = 30000;

if (!DISCORD) {
	console.error("Error: No DISCORD variable in enviroment.\n Perhaps you forgot to include it?");
	process.exit(1);
}

if (!PREFIX) {
	console.error("Error: No PREFIX variable in enviroment.\n I will use '!' as prefix, but you should set one.");
}

/**
 * Starts the web server.
 */
require("./imports/webserver");

/**
 * Util functions to use anywhere.
 */
const utilities = require("./imports/utilities");

/**
 * Reddit wrapper.
 */
const reddit = require("./imports/reddit");

/**
 * Discord wrapper. 
 */
const Discord = require("discord.js");

/**
 * Discord client for he bot.
 */
const client = new Discord.Client();

/**
 * When the discord bot is ready, it will print the timestamp and
 * set the bot activity on discord.
 */
client.on("ready", () => {
	console.log(`[${utilities.dateNow()}] bot ready! :D and logged in as: ${client.user.tag}!`);
	client.user.setActivity("Reddit", { type: "WATCHING" });
});

/* =============================================
*           bot "on events" handlers
================================================*/

/**
 * Message handler for the bot. At every message the bot recieves, it will use
 * this handler.
 */
client.on("message", msg => {
	//never interact with bots >:C
	if (msg.author.bot) return;

	const msgArray = msg.content.split(" ");
	const cmd = msgArray[0];
	const args = msgArray.slice(1);

	const prefix = PREFIX? PREFIX : "!";

	switch (cmd) {
		case `${prefix}ping`:
			ping(msg);
			break;
		case `${prefix}reddit`:
			redditPost(msg);
			break;
		case `${prefix}about`:
			aboutBot(msg);
			break;
		case `${prefix}help`:
		case `${prefix}h`:
			helpBot(msg,prefix);
			break;
		default:
			if (IsACommand(cmd, prefix)){
				console.log(`[${utilities.dateNow()}] command not found: ${cmd + args.toString()}`);
				msg.channel.send("I don't understand that command");
			}
			break;
	}
});

/* =============================================
*                   Functions
================================================*/

/**
 * ping- pong!
 * @param {Message} msg Message object to the bot
 * @author by Camilo Zambrano
 */
function ping(msg) {
	msg.reply("pong");
}

/**
 * Replies to a message with basic information about the bot.
 * @param {Message} msg Message to reply with the bot information
 * @author by Camilo Zambrano
 */
function aboutBot(msg) {
	let aboutMsg = new Discord.RichEmbed()
		.setTitle("About:")
		.setDescription("Information about this bot! 🤖")
		.setColor("#3174e0")
		.setThumbnail(client.user.displayAvatarURL)
		.addField("Name of the bot: ", client.user.username)
		.addField("Created on: ", client.user.createdAt)
		.addField("Code: ", "https://github.com/cawolfkreo/discord-reddit-bot")
		.setFooter("The bot is happy you care about him 🤖👍");

	msg.reply(aboutMsg);
}

/**
 * Sends the help information, wich right now is the bot commands.
 * @param {Message} message the message to reply with the information
 * @param {String} prefix Bot prefix command
 * @author by Camilo Zambrano
 */
function helpBot(message, prefix) {
	let helpMsg = new Discord.RichEmbed()
		.setTitle("Help:")
		.setDescription("commands for the bot")
		.setColor("#3174e0")
		.setThumbnail(client.user.displayAvatarURL)
		.addField(`${prefix}ping`, "pong!")
		.addField(`${prefix}about`, "info about this bot")
		.addField(`${prefix}help`,"This very message 😜")
		.addField(`${prefix}reddit`,"still in Beta. Gets last hour top posts from r/me_irl")
		.setFooter("The bot wishes you to enjoy using this commands 🤖👍");

	message.channel.send(helpMsg);
}

/**
 * 
 * @param {Message} msg Message object to the bot
 * @author by Yesid Bejarano
 */
function redditPost(msg) {
	reddit.getTopPosts("me_irl")
		.then(res => asyncPosts(msg, res))
		.catch(error => {
			console.log(`[${utilities.dateNow()}] Error: ${error}`);
		});
}

/**
 * sends an array of reddit posts with some seconds in between them.
 * @param {Message} msg msg to get the channel for the message to send
 * @param {Array} posts reddit posts
 * @author by Yesid Bejarano
 */
function asyncPosts(msg, posts) {
	if (posts.length > 0) {
		msg.channel.send(posts[0].url);
		setTimeout(() => {
			const tail = posts.splice(1);
			asyncPosts(msg, tail);
		}, time);
	}
}

/**
 * This function tests if a message is a probable command for the bot or not.
 * @param {String} cmd The message to test if it is command or not
 * @param {String} prefix The prefix for commands
 * @author by Camilo Zambrano
 */
function IsACommand (cmd,prefix) {
	const begin = cmd.slice(0,prefix.length);

	return begin === prefix && cmd.charAt(0) !== " ";
}

/**
 * Discord login
 */
client.login(DISCORD);