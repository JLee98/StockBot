var config = require('../config.json');
const https = require('https');

module.exports = {
	name: 'rate',
	description: 'General ratings score and recommendation',
	execute(message, args) {
		if(args.length == 0) {
			return message.channel.send("Please provide a stock name");
		}
    	else if(args.length > 1) {
			return message.channel.send("Please only provide a stock name");
		}
		else {
			var stock = args[0];
			var path = config.fmp_get_rating + stock.toUpperCase() + "?apikey=" + config.fmp_api_key;
			var rating_info_string= "";
			var rating_info;
			const options = {
				hostname: config.fmp_url,
				port: 443,
				path: path,
				method: 'GET'
			}
			const req = https.request(options, res => {
				console.log(`Status code: ${res.statusCode}`);

				res.on('data', d => {
                    rating_info_string += d;
                //}).on('end', () => {
					rating_info = JSON.parse(rating_info_string);
                    rating_info = rating_info[0];
                    if(rating_info == null){
                        return message.channel.send(`No analysts ratings or recommendations.`)
                    }
                    console.log(rating_info);
					var symbol = rating_info.symbol;
                    var rating = rating_info.rating;
                    var ratingScore = rating_info.ratingScore;
                    var ratingRec = rating_info.ratingRecommendation;
                    return message.channel.send(`$${symbol} is rated ${rating}, ${ratingScore}/5 and recommended as a ${ratingRec}`);
				})

			});
			req.on('error', error => {
				console.log(error);
			});

			req.end();
		}
	},
};