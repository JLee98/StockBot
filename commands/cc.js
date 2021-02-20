const https = require('https');
var config = require('../config.json');
//var schedule = require('node-schedule');
//var temp = require('../job.js');

module.exports = {
	name: 'cc',
	description: 'cryptocurrency',
	execute(message, args) {
		if(args.length == 0) {
			return message.channel.send("Please provide a cryptocoin");
		}
    	else if(args.length > 1) {
			return message.channel.send("Please only provide a cryptocurrency (Ex: !cc btc)");
		}
		else {
			var coin = args[0];
			var path = config.fmp_get_quote + coin.toUpperCase() + "USD?apikey=" + config.fmp_api_key;
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
					try{
						var symbol = coin_info.symbol;
						var price = coin_info.price;
						return message.channel.send(`Symbol ${symbol}\n Price $${price}`);
					}
					catch(TypeError){
						console.log(TypeError.message + `for ${coin}`);
						return message.channel.send(`${coin} was not found.`);
					}
					
				})
			});
			req.on('error', error => {
				console.log(error);
			});
		
			req.end();
			
		}
	},
};