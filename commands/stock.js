var config = require('../config.json');
const https = require('https');

module.exports = {
	name: 'stock',
	description: 'stonks',
	execute(message, args) {
		if(args.length == 0) {
			return message.channel.send("Please provide a stock name");
		}
    else if(args.length > 1) {
			return message.channel.send("Please only provide a stock name");
		}
		else {
			var stock = args[0];
			var path = config.fmp_get_stock + stock + "?apikey=" + config.fmp_api_key;
			var stock_info_string= "";
			var stock_info;
			const options = {
				hostname: config.fmp_url,
				port: 443,
				path: path,
				method: 'GET'
			}
			const req = https.request(options, res => {
				console.log(`Status code: ${res.statusCode}`);

				res.on('data', d => {
					stock_info_string += d;
				}).on('end', () => {
					stock_info = JSON.parse(stock_info_string);
					console.log(stock_info);
					var symbol = stock_info.symbol;
					var price = stock_info.profile.price;
					return message.channel.send(`The current price for ${symbol} is $${price}`);
				});

			});
			req.on('error', error => {
				console.log(error);
			});

			req.end();
		}
	},
};
