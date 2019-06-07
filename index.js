
const check = require('./check');
const bot = require('./bot');

const EVIL = '\u{1F608}';
const LOCK = '\u{26D4}';
const UNLOCK = '\u{2714}';

bot.on('message', function(msg) {
    try {
        let imei = msg.text.split('\n').map(text => text.trim());
        imei = imei.filter(i => i.length = 15);

        check(imei).then(result => {
            const message = result.map(({data}) => `${data.imei}: ${data.locked ? LOCK : EVIL}`).join('\n')

            console.log(`${msg.chat.username} (${msg.chat.id}):\n${message}\n`)

            bot.sendMessage(msg.chat.id, message);
        }).catch(e => {
            bot.sendMessage(msg.chat.id, `error: ${e.message}`);
        });
    }
    catch (e) {
        bot.sendMessage(msg.chat.id, `error: ${e.message}`);
    }
});
