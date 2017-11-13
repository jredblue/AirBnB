function useData(data) {
    console.log(data);
    page2 = document.getElementById("page2");
    $("html, body").animate({scrollTop: page2.offsetTop}, 1000);
    var allPrices = [];
    var allInRangePrices = [];
    var allInRangeLats = [];
    var allInRangeLongs = [];
    var allInReviewRangeLats = [];
    var allInReviewRangeLongs = [];
    var sizesPrice = [];
    var colorsPrice = [];
    var reviewScores = [];
    var reviewColors = [];
    
    // Price Estimation
    var count = 0;
    var avgPrice = 0.0;
    var latInput = parseFloat(document.getElementById("latField").value);
    var longInput =  parseFloat(document.getElementById("longField").value);
    for (row = 1; row < 8707; row++) 
    {
    	var allPrice = parseFloat(data[row][60].substring(1, data[row][60].length).replace(/,/g , ""));
    	if (allPrice < 1000 && allPrice > 0)
    	{
    		allPrices.push(allPrice);
    	}
    	var latVar = parseFloat(data[row][48]);
    	var longVar = parseFloat(data[row][49]);
    	if (latVar < latInput + .01 && latVar > latInput - .01
    		&& longVar < longInput + .01 && longVar > longInput - .01) 
    	{
    		allInRangeLats.push(latVar);
    		allInRangeLongs.push(longVar);
    		var price = parseFloat(data[row][60].substring(1, data[row][60].length).replace(/,/g , ""));
    		if (price < 1000 && price > 0)
    		{
    			allInRangePrices.push(price);
    			if (price < 100)
    			{
    				sizesPrice.push(10);
    				colorsPrice.push("rgb(44, 160, 101)");
    			}
    			else if(price >= 100 && price < 200)
    			{
    				sizesPrice.push(20);
    				colorsPrice.push("rgb(93, 164, 214)");
    			}
    			else 
    			{
    				sizesPrice.push(30);
    				colorsPrice.push("rgb(255, 65, 54)")
    			}
    		}
    		var reviewScore = parseFloat(data[row][79]);
    		if (reviewScore >= 0 && reviewScore <= 100)
    		{
    			allInReviewRangeLats.push(latVar);
    			allInReviewRangeLongs.push(longVar);
    			reviewScores.push(reviewScore);
    			if (reviewScore < 80 && reviewScore >= 0)
    			{
    				reviewColors.push("rgb(255, 65, 54)");
    			}
    			else if (reviewScore >= 80 && reviewScore < 96)
    			{
    				reviewColors.push("rgb(44, 160, 101)");
    			}
    			else if (reviewScore >= 96 && reviewScore <= 100)
    			{
    				reviewColors.push("rgb(93, 164, 214)");
    			}
    		}
    		avgPrice = (avgPrice * count + price) / (count + 1);
    		count++;
    	}
    }
    document.getElementById("priceEstimationTitle").innerHTML = "Price Estimation";
    document.getElementById("priceEstimationTitle").style.borderBottom = "2px solid aqua";
    document.getElementById("priceEstimationDescription").innerHTML = "Weekly average income homeowner can make with AirBnB: ";
    document.getElementById("priceEstimationResult").innerHTML = "$" + Number(avgPrice * 7).toFixed(2);
    
    // Bookings Optimization
    count = 0;
    var avgIdealPrice = 0.0;
    for (row = 1; row < 8707; row++)
    {
    	var latVar = parseFloat(data[row][48]);
    	var longVar = parseFloat(data[row][49]);
    	if (latVar < latInput + .01 && latVar > latInput - .01
    		&& longVar < longInput + .01 && longVar > longInput - .01) 
    	{
    		if (data[row][77].length > 0 && data[row][78].length > 0)
    		{
    			var firstDateArray = data[row][77].split("/");
    			var lastDateArray = data[row][78].split("/");
    			var oneDay = 24*60*60*1000; 
				var firstDate = new Date(firstDateArray[2],firstDateArray[0],firstDateArray[1]);
				var secondDate = new Date(lastDateArray[2],lastDateArray[0],lastDateArray[1]);
				var reviewRange = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
				var reviewRangeMonths = reviewRange / 30.0;
				if (data[row][76] != "0")
				{
					var totalReviews = parseFloat(data[row][76]);
					var reviewsPerMonth = totalReviews / reviewRangeMonths;
					if (reviewsPerMonth >= 2)
					{
						var price = parseFloat(data[row][60].substring(1, data[row][60].length).replace(/,/g , ""));
						avgIdealPrice = (avgIdealPrice * count + price) / (count + 1);
						count++;
					}
				}
    		}
    	}
    }
    document.getElementById("bookingsOptimizationTitle").innerHTML = "Bookings Optimization";
    document.getElementById("bookingsOptimizationTitle").style.borderBottom = "2px solid aqua";
    document.getElementById("bookingsOptimizationDescription").innerHTML = "Ideal price to yeild maximum bookings: ";
    document.getElementById("bookingsOptimizationResult").innerHTML = "$" + Number(avgIdealPrice).toFixed(2);

    // Graph 1 
	var sanFrancisco = {
  		y: allPrices,
  		name: 'San Francisco',
  		type: 'box'
	};
	var yourLocation = {
  		y: allInRangePrices,
  		name: 'Your Location',
  		type: 'box'
	};
	var boxPlotLayout = {
  		title: 'Price per Night ($)'
	};
	var boxPlotData = [sanFrancisco, yourLocation];
	Plotly.newPlot('graph1', boxPlotData, boxPlotLayout);
	
	// Graph 2
	var priceTrace = {
  		x: allInRangeLats,
  		y: allInRangeLongs,
  		mode: 'markers',
  		showlegend: false,
  		marker: {
  			color: colorsPrice,
    		size: sizesPrice
  		}
	};
	var greenPriceLegend = {
		x: [null],
		y: [null],
		name: '$0 - $99',
		marker: {
			color: 'rgb(44, 160, 101)'
		}
	}
	var bluePriceLegend = {
		x: [null],
		y: [null],
		name: '$100 - $199',
		marker: {
			color: 'rgb(93, 164, 214)'
		}
	}
	var redPriceLegend = {
		x: [null],
		y: [null],
		name: '$200 - $1000',
		marker: {
			color: 'rgb(255, 65, 54)'
		}
	}
	var priceData = [priceTrace, greenPriceLegend, bluePriceLegend, redPriceLegend];
	var priceLayout = {
  		title: 'Price Density'
	};
	Plotly.newPlot('graph2', priceData, priceLayout);
	
	// Graph 3
	var reviewTrace = {
  		x: allInReviewRangeLats,
  		y: allInReviewRangeLongs,
  		mode: 'markers',
  		showlegend: false,
  		marker: {
  			color: reviewColors
  		}
	};
	var redReviewLegend = {
		x: [null],
		y: [null],
		name: '0 - 79',
		marker: {
			color: 'rgb(255, 65, 54)'
		}
	}
	var greenReviewLegend = {
		x: [null],
		y: [null],
		name: '80 - 95',
		marker: {
			color: 'rgb(44, 160, 101)'
		}
	}
	var blueReviewLegend = {
		x: [null],
		y: [null],
		name: '96 - 100',
		marker: {
			color: 'rgb(93, 164, 214)'
		}
	}
	var reviewData = [reviewTrace, redReviewLegend, greenReviewLegend, blueReviewLegend];
	var reviewLayout = {
  		title: 'Review Density'
	};
	Plotly.newPlot('graph3', reviewData, reviewLayout);
}
function parseData(url, callBack) {
    Papa.parse(url, {
        download: true,
        dynamicTyping: true,
        complete: function(results) {
            callBack(results.data);
        }
    });
}
function parseCSV(){
	parseData("listings.csv", useData);
}

