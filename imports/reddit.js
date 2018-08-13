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

/**
 * snoowrap import.
 */
const snoowrap = require("snoowrap");

/**
 * Util functions import.
 */
const utilities = require("./utilities");

/**
 * Reddit wrapper made by snoowrap.
 */
const reddit = new snoowrap({
	clientId: RCLID,
	clientSecret: RCLISECRET,
	userAgent: RAGENT,
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

console.log(`[${utilities.dateNow()}] Reddit wrapper ready! :D`);

/* =============================================
*                 Module Export
================================================*/

module.exports = {
	getTopPosts
};