const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://restaurant.michelin.fr/restaurants/france/page-';
var urlPagei;


var UrlsObj={};
UrlsObj.contenu=[];	

var RestoInfoObj={};
RestoInfoObj.contenu=[];

var a={};
a.Index=1;

var lastPage={};
lastPage.i=0;

var k=0;

async function lastPageMichelin(){
	await rp(url)
	  .then(function(html) {
		
		//console.log($('.mr-pager-item', html)[12].children[0].children[0].data);
		lastPage.i=$('.mr-pager-item', html)[12].children[0].children[0].data;
		console.log(lastPage.i);
	  })
	  .catch(function(err) {
		//handle error
	  });
	}

async function scrapping(){
	
	for(i=1;i<lastPage.i;i++)
	{
		console.log(i);
		urlPagei=url+i.toString();
		await rp(urlPagei)
			.then(function (html){
			//success!
			
			const RestosUrls = [];
			for (let i = 0; i < $('li > div > a', html).length; i++) {
				RestosUrls.push($('li > div > a', html)[i].attribs.href);
			}
			UrlsObj.contenu.push(RestosUrls);
			
			})
			.catch(function(err){
			//handle error
			});
			
			
			for(j=0;j<UrlsObj.contenu[i-1].length;j++)
			{
				console.log('https://restaurant.michelin.fr' + UrlsObj.contenu[i-1][j]);
				await rp('https://restaurant.michelin.fr' + UrlsObj.contenu[i-1][j])
				  .then(function(html){
					//success!
					
					const RestosInfoI = [];
					
					RestosInfoI.push($('h1', html)[0].children[0].data.trim());
					RestosInfoI.push($('.poi_intro-display-prices', html)[0].children[0].data.trim());
					RestosInfoI.push($('.thoroughfare', html)[0].children[0].data);
					RestosInfoI.push($('.postal-code', html)[0].children[0].data);
					RestosInfoI.push($('.locality', html)[0].children[0].data);
					
					RestoInfoObj.contenu.push(RestosInfoI);
					
					console.log(RestoInfoObj.contenu[k]);
					k++;
					console.log('\n\n\n');
				  })
				  .catch(function(err){
					//handle error
				  });
			}
			
			
	}

	
	
}

lastPageMichelin();
setTimeout(function(){scrapping()},3000);

