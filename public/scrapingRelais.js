const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://www.relaischateaux.com/us/site-map/etablissements?fbclid=IwAR0HQKFioaY9j_FozzGA8whHm4oSh7Gk4vhtavhKpejNuu9zt2SA6lfbWCo';


var UrlsObj={};
UrlsObj.contenu=[];	

var ChateauInfoObj={};
ChateauInfoObj.contenu=[];
var i=0;

async function temp(url,i){
	await rp(url)
			.then(function(html){
				  //success
				  
				   const ChateauInfoI = [];
				ChateauInfoI.push($('h3', html)[0].children[0].data);
				ChateauInfoI.push($('.capacity', html)[0].children[0].data.trim())
				ChateauInfoI.push($('.price', html).text());

				ChateauInfoObj.contenu.push(ChateauInfoI);
				
				if(ChateauInfoObj.contenu[i]!=null){
				console.log(ChateauInfoObj.contenu[i]);
				console.log("\n\n");}
				
				
			  })
			  .catch(function(err){
				//handle error
			  });
}

async function scrap(){

rp(url)
	  .then(function(html){
		console.log($('.listDiamond > li>a', html).length);
		
		while(i<$('.listDiamond > li>a', html).length) 
		{
			UrlsObj.contenu.push($('.listDiamond > li>a', html)[i].attribs.href);
			//console.log(UrlsObj.contenu[i]);
			
			temp(UrlsObj.contenu[i],i);
			i++;
		}
		
		
	  })
	  .catch(function(err){
		//handle error
	  });
	  
}
scrap();