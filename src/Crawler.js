const puppeteer            = require('puppeteer');

const path                 = require('path');
const retry                = require('async-retry');
const fs                   = require('fs');

const { launchingOptions } = global.getConfig('puppeteer');
// const SELECTORS            = require('./constant/selector');
// const URLS                 = require('./constant/urls');

const DEFAULT_TIMEOUT      = 2000;
const MAX_TIMEOUT          = 20000;

module.exports = class Crawler {

    constructor (force, date, logger) {
        this.logger  = logger;
        this.force   = force;
        this.date    = date;
        this.browser = null;
        this.page    = null;
    }
    
    // async init () {
    //     // Launching puppeteer and adding some config
    //     const preLoadFile  = fs.readFileSync(path.join(__dirname, '/preload.js'), 'utf8');
    //     this.browser       = await puppeteer.launch(launchingOptions);
    //     this.page          = await this.browser.newPage();
    //     await this.page.setExtraHTTPHeaders({
    //         'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
    //     });

    //     await this.page.evaluateOnNewDocument(preLoadFile);
    // }
    
    async crawl () {
        // await this.init();
        
        // await this.page.waitFor(DEFAULT_TIMEOUT);
        // await this.page.goto('https://mail.google.com');
        // await this.page.waitFor(DEFAULT_TIMEOUT);
        
        // await this.page.click('input[type="email"]');
        // await this.page.keyboard.type('alexpress.dummy2019@gmail.com');
        // await this.page.waitFor(DEFAULT_TIMEOUT);
        
        // await this.page.click('div#identifierNext');
        
        // await this.page.waitFor(DEFAULT_TIMEOUT);
        // await this.page.click('input[type="password"]');
        // await this.page.keyboard.type('6Wwt3MCsLcsJAQZ');
        // await this.page.click('div#passwordNext');
        // await this.page.waitFor(100000);
        
        // let test = await this.page.$eval('input[type="password"]', e => e.getAttribute('jsname'));
        // console.log(test);
        // await this.page.waitFor(100000);
        // process.exit(-1);
        
        // await this.page.click('div#passwordNext');
    }
    
    async execute () {
        const retryOption = {
            retries   : 10,
            minTimeout: 20000,
            maxTimeout: 600000,
            onRetry   : (err, i) => {
                if (err) {
                    this.retryFlag = true;
                    this.logger.info(`Number of attempts to retry : #${i}`);
                    this.logger.info(`Retry for error : ${err.toString()}`);
                }
            }
        };

        await retry(async () => {
            // if anything throws, we retry
            await this.crawl();
        }, retryOption);
    }
}
