"use strict";

/* =============================================
*                   Imports
================================================*/

/**
 * Port for the Express sever to listen
 */
const { PORT } = process.env;

if (!PORT) {
	console.error("Error: No PORT variable in enviroment.\n Perhaps you forgot to include it?");
	process.exit(1);
}

/**
 * Express module for web server.
 */
const express = require("express");

/**
 * npm Package information. 
 */
const packageInfo = require("../package.json");

/**
 * Util functions for logging and other purposes.
 */
const utilities = require("./utilities");

/* =============================================
*               Server Config
================================================*/

/**
 * Express app.
 */
const app = express();

/**
 * Makes the app listen to the root URL and respond with the version of the NPM module.
 */
app.get("/", ( req, res ) => {
	res.json({ version: packageInfo.version });
});

const server = app.listen(PORT, () => {
	const Host = server.address().address;
	const Port = server.address().port;

	console.log(`[${utilities.dateNow()}] Express web server Ready!! :D - on host ${Host} and ${Port}`);
});