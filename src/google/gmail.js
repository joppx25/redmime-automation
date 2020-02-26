const {google} = require('googleapis');
const moment   = require('moment');

async function getEmailList (auth, otherOpt) {
    try {
        
        const gmail = google.gmail({
            version: 'v1',
            auth
        });
        
        const options = {
            userId: 'me', // default to the user of this application
            labelIds: ['SENT'],
            ...otherOpt,
        };
        
        const emailList = await gmail.users.messages.list(options);
        if (Object.values(emailList.data).length) {
            const msgObj = await gmail.users.messages.get({
                userId: 'me',
                id: emailList.data.messages[0].id,
            });
            
            let msgHeaders = msgObj.data.payload.headers;
            let msgBody    = msgObj.data.payload.parts[0].body; // contains the size and base64 format of the message

            let extractedDate = msgHeaders[3].name === 'Subject'? msgHeaders[3].value.match(/\d{4}(\/|\-)\d{2}(\/|\-)\d{2}/gm)[0] : moment(msgHeaders[1].value).format('YYYY-MM-DD');
            let emailMsg      = Buffer.from(msgBody.data, 'base64').toString('utf-8');
            
            return {
                date: extractedDate,
                message: emailMsg
            };
        }

    } catch(err) {
        console.log(err);
        process.exit(-1);
    }
}

module.exports = {
    getEmailList
};
