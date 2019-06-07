process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');
const APPNAME = require('./package').name;
const config = require('rc')(APPNAME);

let bot = new TelegramBot(config.token, {
    polling: {
        interval: 100
    }
});

bot.getMe().then(function(me) {
    console.log('Hello! My name is %s!', me.first_name);
    console.log('My id is %s.', me.id);
    console.log('And my username is @%s.', me.username);
    console.log('')
});

// bot.sendMessage(config.user, "I'm online!");

module.exports = bot;
