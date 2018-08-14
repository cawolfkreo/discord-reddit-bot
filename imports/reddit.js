"use strict";

/* =============================================
*                   Imports
================================================*/
/**
 * Reddit secrets and keys.
 */
const { RCLID, RCLISECRET, RAGENT, RUSER, RPASSWORD } = process.env;

if(!RCLID) {
	console.error("Error: No RCLID variable in enviroment.\n Perhaps you forgot to include it?");
	process.exit(1);
}

if(!RCLISECRET) {
	console.error("Error: No RCLISECRET variable in enviroment.\n Perhaps you forgot to include it?");
	process.exit(1);
}

if(!RAGENT) {
	console.log("Error: No RAGENT variable in enviroment.\n i will use: 'panda' as the reddit agent!");
	process.exit(1);
}

if(!RUSER) {
	console.error("Error: No RUSER variable in enviroment.\n Perhaps you forgot to include it?");
	process.exit(1);
}

if(!RPASSWORD){
	console.error("Error: No RPASSWORD variable in enviroment.\n Perhaps you forgot to include it?");
	process.exit(1);
}

/**
 * snoowrap import.
 */
const snoowrap = require("snoowrap");

/**
 * Util functions import.
 */
const utilities = require("./utilities");

/**
 * Reddit wrapper with snoowrap.
 */
const reddit = new snoowrap({
	clientId: RCLID,
	clientSecret: RCLISECRET,
	userAgent: (RAGENT? RAGENT : "panda"),
	username: RUSER,
	password: RPASSWORD
});

/* =============================================
*                   Functions
================================================*/

/**
 * returns a promise that will resolve with the top post of the last hour
 * @param {String} subreddit The name of the subreddit
 * @author by Camilo Zambrano
 */
function getTopPosts(subreddit) {
	const sub = reddit.getSubreddit(subreddit);

	return sub.getTop({time: "hour"});
}

/**
 * Log to print when the wrapper is ready.
 */
console.log(`[${utilities.dateNow()}] Reddit wrapper ready! :D`);

/* =============================================
*                 Module Export
================================================*/

module.exports = {
	getTopPosts
};