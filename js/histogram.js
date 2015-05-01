

function generate_histogram(div_id){
	d3.select(div_id).selectAll('svg').remove();
	
	var tip = d3.tip()
		  .attr('class', 'd3-tip')
		  .offset([-10, 0])
		  .html(function(d) {
			return "<span style='color:Gold'>" + d.name + "</span>" + "<br/>" + 
				   "<span >" + d.value + " encounters</span>";
		  })

	var num_array = [];
	filteredMemberDataByCondition.forEach(function(d) {
		if(d["encounterList"].length>0)
			num_array.push(d["encounterList"].length);
        //console.log(d.Happiness + " | " + d.Song);
    });
	var array_max = arrayMax(num_array);
	//console.log(num_array);
	//console.log(array_max);
	//var values = d3.range(50).map(d3.random.bates(10));

	var formatCount = d3.format(",.0f");

	var margin = {top: 30, right: 600, bottom: 170, left: 30},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var x = d3.scale.linear()
		.domain([0, array_max])
		.range([0, width]);
	
	var ticks_count = (array_max > 50) ? 20 : 10;
	// Generate a histogram using twenty uniformly-spaced bins.
	var data = d3.layout.histogram().bins(x.ticks(ticks_count))(num_array);
	//console.log(data);
	var y = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d.y; })])
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var svg = d3.select(div_id).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var bar = svg.selectAll(".barz")
		.data(data)
	  .enter().append("g")
		.attr("class", "bar")
		.attr("fill", "#029eca")
		.style("cursor","pointer")
		.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

	bar.append("rect")
		.attr("x", 1)
		.attr("width", x(data[0].dx) - 1)		
		.attr("height", function(d) { return height - y(d.y); });
		//.on("mouseover",tip.show)
		//.on("mouseout",tip.hide);

	bar.append("text")
		.attr("dy", ".75em")
		.attr("fill", "#029eca")
		.attr("y", -20)
		.attr("x", x(data[0].dx) / 2)
		.attr("text-anchor", "middle")
		.text(function(d) { if(d.y>0)return formatCount(d.y); });
		
	svg.append("text")
		  .attr("class", "title")
		  .attr("x", 350)
		  .attr("y", 300)
		  .text("Frequency of Visits");

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

}


function arrayMax(arr) {
  return arr.reduce(function (p, v) {
    return ( p > v ? p : v );
  });
}