const {google} = require('googleapis');

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
                // format: 'raw'
            });
            
            console.log(msgObj.data);
            process.exit(-1);
        }

    } catch(err) {
        console.log(err);
        process.exit(-1);
    }
}

module.exports = {
    getEmailList
};
