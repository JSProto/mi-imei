
const check = require('./check');
const bot = require('./bot');

const EVIL = '\u{1F608}';
const LOCK = '\u{26D4}';
const UNLOCK = '\u{2714}';

const wait = (duration = 1000) => new Promise((resolve, reject) => setTimeout(resolve, duration));

function stringToArray(string){
    return string.split('\n').map(t => t.trim())
}
function arrayToObject(array){
    return array.reduce((memo, key) => ({...memo, [key]: null}), {})
}

function objectToString(object){
    return Object.keys(object).map((v) => `${v}: ${object[v] === null ? '?' : (object[v] ? LOCK : EVIL)}`).join('\n');
}


bot.on('message', function(msg) {
    try {
        let rows = stringToArray(msg.text).filter(i => i.length = 15);
        let pairs = arrayToObject(rows);

        console.log('pairs:', pairs);


        console.log(`request ${msg.chat.username} (${msg.chat.id}):\n${msg.text}\n`)
        console.log(`response ${msg.chat.username} (${msg.chat.id}):\n`)

        bot.sendMessage(msg.chat.id, 'wait').then(msg => {
            function send(){
                const message = objectToString(pairs);

                return bot.editMessageText(message, {
                    chat_id: msg.chat.id,
                    message_id: msg.message_id,
                }).then(wait);
            }

            rows.reduce((promise, imei) => {
                return promise.then(() => check(imei).then(({data}) => {
                    pairs[imei] = data.locked;
                    console.log(`${imei}: ${data.locked ? LOCK : UNLOCK}`);
                    return send();
                }))
            }, Promise.resolve()).then(() => {
                console.log('finish')
            }).catch((e) => {
                console.log('error: ', e.message)
                return bot.sendMessage(msg.chat.id, 'error: ' + e.message)
            })

        });

    }
    catch (e) {
        bot.sendMessage(msg.chat.id, `error: ${e.message}`);
    }
});
