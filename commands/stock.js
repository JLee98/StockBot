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
		else { // using /api/v3/quote/ endpoint - can do batch requests
			var stock = args[0];
			var path = config.fmp_get_quote + stock.toUpperCase() + "?apikey=" + config.fmp_api_key;
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
                //}).on('end', () => {
					stock_info = JSON.parse(stock_info_string);
                    stock_info = stock_info[0];
                    console.log(stock_info);
					var symbol = stock_info.symbol;
                    var price = stock_info.price;
					var percChange = stock_info.changesPercentage;
					var change = stock_info.change;
                    var low = stock_info.dayLow;
                    var high = stock_info.dayHigh;
					var ma50 = stock_info.priceAvg50;
					var ma200 = stock_info.priceAvg200;
					var volume = stock_info.volume;
                    var open = stock_info.open;
					
                    return message.channel.send(`$${symbol} is $${price}
					\nChange from Prev Close: $${change}
                    \nPercent Change from Prev Close: ${percChange}%
					\nOpen: $${open}
					\nLow: $${low} 
					\nHigh: $${high} 
					\nVolume: ${volume}`);
				});

			});
			req.on('error', error => {
				console.log(error);
			});

			req.end();
		}
	},
};