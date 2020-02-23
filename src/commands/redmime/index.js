const fs              = require('fs');
const inquirer        = require('inquirer')
const figlet          = require('figlet')
const path            = require('path');
const moment          = require('moment');
const googleAuth      = require('../../google/googleAuth');
const gmail           = require('../../google/gmail');

/** Getting secret credential */
const secretFile = path.join(__dirname, '../../../keys/client_secret.json');
const secrets = JSON.parse(fs.readFileSync(secretFile));

// define the scope for our app. Note you can specify multiple scopes depends on your needs
const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];

/**
 * #########  Starts CLI program  #################
**/

console.log(figlet.textSync('Redmime Automation', { horizontalLayout: 'full' }))
console.log(`Lets automate logging your task in gmail to redmime!`);

let options = {};
let questions = [
    {
        type: 'input',
        name: 'nResults',
        message: 'How many results do you want to retrieve? (default 1)'
    },
    {
        type: 'input',
        name: 'dateFrom',
        message: 'Start date (YYYY-MM-DD)? (default today)'
    },
    {
        type: 'input',
        name: 'dateTo',
        message: 'End Date (YYYY-MM-DD)? (default today)'
    },
    {
        type: 'input',
        name: 'extraParam',
        message: 'Extra parameter to search specific email'
    },
]

inquirer.prompt(questions).then(async answers => {
    const today = moment().format('YYYY-MM-DD');
    options = {
        maxResults: answers['nResults'] || 1,
        timeMin: answers['dateFrom']    || today,
        timeMax: answers['dateTo']      || today,
        params : answers['extraParam']  || '',
    }
    console.log('Searching with options: %j ', options); 
    return await execGmailAPI(options);

}).catch(err => {
    console.log('Error retrieving events from the calendar' + err);
});

async function execGmailAPI (options) {
    try {
        const oAuthClient = await googleAuth.generateOAuthClient(secrets, scopes);
        console.log('oAuth Client received!');
        console.log('Getting email content');
        
        const mails = await gmail.getEmailList(oAuthClient, options);
        // get the tasks and percentage done
        let tasks = getTasks(mails.message);
    } catch(err) {
        console.log(err);
        process.exit(-1);
    }
}

function getTasks (message) {
    let splitMessage = message.split('\r\n');
    let tasks        = [];

    splitMessage.forEach((str, idx) => {
        if (str.indexOf('*Tasks:') >= 0) {
            let cloneIdx = idx;
            while (splitMessage[cloneIdx + 1].indexOf('*Expected date:') < 0) {
                let cleanMsg = splitMessage[idx + 1].replace(/\*|\-/g, '').replace(/^\s+|\s+&/g, '');
                tasks.push(cleanMsg);
                cloneIdx++;
            }
            return;
        }
    });

    return tasks;
}
