const https = require('https');
var config = require('../config.json');
//var schedule = require('node-schedule');
//var temp = require('../job.js');

module.exports = {
	name: 'crypto',
	description: 'cryptocurrency',
	execute(message, args) {
		if(args.length == 0) {
			return message.channel.send("Please provide a cryptocoin");
		}
    	else if(args.length > 1) {
			return message.channel.send("Please only provide a cryptocoin");
		}
		else {
			var coin = args[0];
			if(coin.length < 4) {
				return message.channel.send("You need another coin to compare price! Ex: BTCUSD")
			}
			var path = config.fmp_get_quote + coin.toUpperCase() + "?apikey=" + config.fmp_api_key;
			var coin_info_string= "";
			var coin_info;
			const options = {
				hostname: config.fmp_url,
				port: 443,
				path: path,
				method: 'GET'
			}
			const req = https.request(options, res => {
				console.log(`Status code: ${res.statusCode}`);
		
				res.on('data', d => {
					coin_info_string += d;
				//}).on('end', () => {
					coin_info = JSON.parse(coin_info_string);
					coin_info = coin_info[0];
					console.log(coin_info);
					var symbol = coin_info.symbol;
					var name = coin_info.name;
					var price = coin_info.price;
					return message.channel.send(`${symbol} (${name}) is $${price}`);
				})
			});
			req.on('error', error => {
				console.log(error);
			});
		
			req.end();
			
		}
	},
};