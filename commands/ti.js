var config = require('../config.json');
const https = require('https');
//SMA - EMA - WMA - DEMA - TEMA - williams - RSI - ADX - stdDev
function checkStrat(arg){
	var strat;
	switch(arg){
		case 'SMA':
			strat = "simple-moving-average-sma/";
			break;
		case 'EMA':
			strat = "exponential-ema/";
			break;
		case 'WMA':
			strat = "weighted-moving-average-wma/";
			break;
		case 'DEMA':
			strat = "double-exponential-moving-average-dema/";
			break;
		case 'TEMA':
			strat = "triple-exponential-moving-average-oscillator-trix/";
			break;
		case 'WILLIAMS':
			strat = "williams-r-willr/";
			break;
		case 'RSI': 
			strat = "relative-strength-indicator-rsi/";
			break;
		case 'ADX':
			strat = "average-directional-movement-adx/";
			break;
		case 'STANDARDDEVIATION':
			strat = "standard-deviation-stddev/";
			break;
	}
	return strat;
}

module.exports = {
	name: 'ti',
	description: 'Technical Indicators on a stock, with a chosen period and chosen type of indicator',
	execute(message, args) {
		if(args[0] == 'help'){
			if(args[1] == null){
				return message.channel.send("Please provide what indicator you'd like to learn. Ex: !ti help rsi\nTypes available: SMA - EMA - WMA - DEMA - TEMA - williams - RSI - ADX - stdDev")
			}
			var strat = args[1].toUpperCase();

			return message.channel.send("https://www.tradingtechnologies.com/xtrader-help/x-study/technical-indicator-definitions/" + checkStrat(strat));

		}
		
		if(args.length == 0 || args.length > 3 || args[1] == null || args[2] == null) {
			return message.channel.send("Please provide a stock name, period and type of technical indicator.\nEx: !ti AAPL 9 sma OR !ti AAPL rsi 14\nTypes available: SMA - EMA - WMA - DEMA - TEMA - williams - RSI - ADX - standardDeviation\n!ti help {type} to understand the indicator");
		}
		else { // is there rsi? no macd, no vwap...can we change endpoint to intraday? min? hour?
			var stock = args[0];
			var type;
			var period;
			if(Object.is(NaN, parseInt(args[1]))){
				type = args[1];
				period = args[2];
			}
			else if(Object.is(NaN, parseInt(args[2]))){
				type = args[2];
				period = args[1];
			}

			var path = config.fmp_get_ema + stock.toUpperCase() + "?period=" + period + "&type=" + type.toLowerCase() + "&apikey=" + config.fmp_api_key;
			var ti_info_string= "";
			var ti_info;
			const options = {
				hostname: config.fmp_url,
				port: 443,
				path: path,
				method: 'GET'
			}
			const req = https.request(options, res => {
				console.log(`Status code: ${res.statusCode}`);

				res.on('data', d => {//we have a lot of data here lol
                    ti_info_string += d;
                }).on('end', () => {
					ti_info = JSON.parse(ti_info_string);
                    //console.log(ti_info);
                    var val = ti_info[0][type];
                    return message.channel.send(`${period} ${type} on the day: ${val.toFixed(2)}`);
					
					//gonna need case switch for indicators other than sma/ema/dema/tema?
				});

			});
			
			req.on('error', error => {
				console.log(error);
			});

			req.end();
		}
	},
};