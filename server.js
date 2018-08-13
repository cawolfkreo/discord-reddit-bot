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
 * 
 */
client.on("ready", () => {
	console.log(`[${utilities.dateNow()}] bot ready! :D and logged in as${client.user.tag}!`);
	client.user.setActivity("Reddit", { type: "WATCHING" });
});

client.on("message", msg => {
	//never interact with bots >:C
	if (msg.author.bot) return;


	if (msg.content === `${PREFIX}ping`) ping(msg);

	if (msg.content === `${PREFIX}reddit`) redditPost(msg);
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
 * 
 * @param {Message} msg Message object to the bot
 * @author by Yesid Bejarano
 */
function redditPost(msg) {
	reddit.getTopPosts("me_irl")
		.then(res => asyncPosts(msg,res));
}

/**
 * 
 * @param {Array} posts reddit posts
 * @author by Yesid Bejarano
 */
function asyncPosts(msg, posts) {
	if(posts.length > 0) {
		msg.channel.send(posts[0].url);
		setTimeout(() =>{
			const tail = posts.splice(1);
			asyncPosts(msg, tail);
		}, time);
	}
}

client.login(DISCORD);
