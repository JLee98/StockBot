var config = require('../config.json');
const https = require('https');

module.exports = {
	name: 'news',
	description: 'News with data, text, image and url',
	execute(message, args) {
		if(args.length == 0) {
			return message.channel.send("Please provide a stock name");
		}
    	else if(args.length > 1) {
			return message.channel.send("Please only provide a stock name");
		}
		else {
			var stock = args[0];
			var path = config.fmp_get_news + "?tickers=" + stock.toUpperCase() + "&apikey=" + config.fmp_api_key;
			var news_info_string= "";
			var news_info;
			const options = {
				hostname: config.fmp_url,
				port: 443,
				path: path,
				method: 'GET'
			}
			const req = https.request(options, res => {
				console.log(`Status code: ${res.statusCode}`);

				res.on('data', d => {
                    news_info_string += d;
                //}).on('end', () => {
					news_info = JSON.parse(news_info_string);
                    //console.log(news_info); // This is an array of articles in JSON 

					let titles = news_info.map(news_info => news_info.title);
					let preview = news_info.map(news_info => news_info.text);
					let url = news_info.map(news_info => news_info.url);
					// I want to make an embedded text that reads "See more", clickable and leads to article url
					for(let i = 0 ; i < 3 ; i++){
						message.channel.send(`${titles[i]}\n${preview[i]}\n${url[i]}\n\n`);
					}
					return;
				});

			});
			req.on('error', error => {
				console.log(error);
			});

			req.end();
		}
	},
};