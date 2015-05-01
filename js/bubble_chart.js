function bubbleChart (data) {
    //console.log(data.length)
    // D3 Bubble Chart 
	d3.select('#bubblechart').selectAll('svg').remove();
    var diameter = 500;
    var width = 200;
    var bubble_svg = d3.select('#bubblechart').append('svg')
                    .attr('width', width)
                    .attr('height', diameter);

    var bubble = d3.layout.pack()
                .size([diameter, 500])
                .value(function(d) {return d.size;})
                .sort(function(a, b) {
                    return -(a.value - b.value);
                })
                .padding(10);

    // generate data with calculated layout values
    var bubble_nodes = bubble.nodes(processData(data))
                        .filter(function(d) { return !d.children; }); // filter out the outer bubble
    

    var sum = 0;
    for(var i=0;i<bubble_nodes.length;i++){
        sum += bubble_nodes[i]['value'];
    }        
    $("#encountercounttext").html("<h1>Encounters: <span style='color:#029eca'>" + sum + "</span></h1>");

    var bubble_vis = bubble_svg.selectAll('g.bubble')
            .data(bubble_nodes)
        .enter().append('g')
            .attr('class', 'bubble')
            .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
	//console.log(bubble_nodes);
	var tip = d3.tip()
		  .attr('class', 'd3-tip')
		  .offset([-10, 0])
		  .html(function(d) {
			return "<span style='color:Gold'>" + d.name + "</span>" + "<br/>" + 
				   "<span >" + d.value + " encounters</span>";
		  })
	
	bubble_svg.call(tip);
	
    bubble_vis.append('circle')
            .attr('r', function(d) { return d.r; })
            .style('fill', '#1f77b4')
			.on("click", function(d){
                activeCondition = d.name;
                filterByCondition(d.name); 
            })
			.on('mouseover', function(d){
                d3.select(this).style("stroke","gold").style("stroke-width","3").transition().duration(200).attr("r",d.r+3);
                tip.show(d);
            })
			.on('mouseout', function(d){
                d3.select(this).transition().duration(200).attr("r",d.r).style("stroke","").style("stroke-width","");
                tip.hide(d);
            });
			

    bubble_vis.append('text')
            .attr('text-anchor', 'middle')
            .attr("dy", ".3em")
            .style("font-size","12")
            .style("font-family","sans-serif")
            .style("fill","white")
            .text(function(d) { if(d.r >= 25) return d.name.substring(0, d.r / 3.2); });

    function processData(data) {
        var conditions = [];
        var counts = [];
        var encounter_index;
        var j;
        var first = true;
        for (var i = data.length - 1; i >= 0; i--) {
            j = conditions.indexOf(data[i].condition);
            if (j<0 || first) {
                conditions.push(data[i].condition);
                counts.push(1);
                if (first) {first=false};
            } else {
                counts[j]++;
            };
        };
        var newDataSet = [];
        for (var i = conditions.length - 1; i >= 0; i--) {
			if(conditions[i] == '') {continue;}
            newDataSet.push({name: conditions[i], size: counts[i]});
        }
        return {children: newDataSet};
    }
}
