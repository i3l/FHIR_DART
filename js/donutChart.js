function drawDonutChart(filteredDataMap){
d3.select("#visittypedougnut").selectAll("svg").remove();
$(".visittypesheading").remove();

var tip = d3.tip()
		  .attr('class', 'd3-tip')
		  .offset([-10, 0])
		  .html(function(d) {
		  	   return "<span style='color:Gold'>" + d.data + "</span>" + "<br/>" + 
				   "<span >" + d.value + " occurances</span>";
		  });


var width = 400,
    height = 300,
    radius = Math.min(width, height) / 2;


var color = d3.scale.category20();

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d){return filteredDataMap[d];});

var arc = d3.svg.arc()
    .innerRadius(radius - 100)
    .outerRadius(radius - 30);

d3.select("#visittypedougnut").append("text")
       .attr("class","visittypesheading")
       .style("margin-right","120")
       .style("font-family","sans-serif")
       .style("font-size","14")
       .text("Visit Types");

var svg = d3.select("#visittypedougnut").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 3 + "," + height / 2 + ")")
    .call(tip);


var visitTypes = Object.keys(filteredDataMap);


var path = svg.selectAll("path")
    .data(pie(visitTypes))
  	.enter()

  	var arcs = path.append("path")
    .attr("fill", function(d, i) { return color(i); })
    .attr("d", arc)
    .on("mouseover",function(d){
    	//console.log(d)
    	tip.show(d)
	})
     .style("cursor","pointer")
    .on("mouseout",tip.hide);

path.append("text")
    .attr("transform", function(d) {
        var c = arc.centroid(d),
            x = c[0],
            y = c[1],
            // pythagorean theorem for hypotenuse
            h = Math.sqrt(x*x + y*y);
			if(x<0 && y<0)
				return "translate(-15.965855847912636,-100.935583433283998)"; 
			else
				if(x>0 && y<0)
					return "translate(-15.965855847912636,-100.935583433283998)"; 
				else
					return "translate(" + (20+(x/h * Math.min(width,height)/2)) +  ',' + ((y/h)) +  ")"; 
    })
    .attr("style","font-size:10px;font-family:sans-serif;")    
    .attr("text-anchor", function(d) {
        return (d.endAngle + d.startAngle)/2 > Math.PI ? "end" : "start"; })
    .text(function(d) { return d.data; });

}