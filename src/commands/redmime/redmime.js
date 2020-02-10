'use strict';

const commands     = require('../command');
const GoogleClient = require('../../GoogleClient');
// const SlackService = require('../../service/SlackService');

/**
 * Run scraper for official site
 *
 * @param {object} options options params from command
 */
module.exports = async function run (options) {
    const { force, date, verbose } = options;
    await execute(force, date, verbose);
};

//
// ─── REGISTRATION COMMAND ──────────────────────────────────────────────────────────────────
//
module.exports.registry = {
    name       : 'redmime:log-task',
    description: 'Execute scraper to log task in redmime',
    options    : [
        {
            flag        : '-f --force <force>',
            description : 'Force to create new data product',
            defaultValue: false,
        },
        {
            flag        : '-d --date <date>',
            description : 'Target date to log the task in redmime',
        },
        {
            flag       : '-b, --verbose',
            description: 'Log more details.'
        },
    ]
};

//
// ─── FUNCTIONS ──────────────────────────────────────────────────────────────────

/**
 *
 * @param verbose
 * @returns {Promise<void>}
 */
async function execute (force, date, verbose) {
    const logger = commands.loggerInfo('Redmime Scraper', 'Redmime', verbose);

    try {
        logger.info("> Start logging task in redmime");

        logger.info('> Done logging redmime');
        process.exit();
    } catch (err) {
        logger.error(err.toString());
        await SlackService.postNotificationToSlack(err.toString(), 'BOT', 'ERROR 17track SCRAPING', 'error');
        process.exit(-1);
    }
}
