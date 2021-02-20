var config = require('../config.json');
const https = require('https');



module.exports = {
	name: 'help',
	description: 'Provides short descriptions of all commands',
	execute(message, args) {
        //!help
        if(args[0] == null){
            return message.channel.send(`Available commands:
            \n!stock - Get real-time daily stock quotes.\nEx: !stock AAPL
            \n!cc - Get real-time daily cryptocurrency quotes.\nEx: !cc BTC
            \n!rate - Get recent rating recommendations on the stock queried.\nEx: !rate AAPL
            \n!news - Get recent reputable news articles about the stock queried.\nEx: !news AAPL
            \n!ti - Get technical indicator values for desired stock ticker, period, and specific indicator\nEx: !ti AAPL 9 sma\nTypes available: SMA - EMA - WMA - DEMA - TEMA - williams - RSI - ADX - stdDev\n!ti help {indicator} to learn specific TI`)
        }

	},
};