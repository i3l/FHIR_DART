function drawMarkov(companynodes,companylinks,nodelist,location){
if(location==1){
  d3.select("#markovvis1").selectAll("svg").remove();  
}else if(location==2){
  d3.select("#markovviz").selectAll("svg").remove();
}

function objectIsInList(object,list){
  for(var i = 0;i<list.length;i++){
    if(object==list[i]){
      return 1;
    }
  }
  return -1;
}
function getProbability(source,target){
  for(var i=0;i<links.length;i++){
    if((links[i]['source']['name']==source) &&  (links[i]['target']['name']==target))
    {
      return links[i]['probability'];
    }
  }
}

var links = companylinks;
console.log(links)
var nodes = companynodes;

links.forEach(function(link) {
  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
});

var width = 700,
    height = 200;

function sigmoid(t,k) {
    return 1/(1+Math.pow(Math.E, -(k*(t-0.5))));
}

var force = d3.layout.force()
    .nodes(nodes)
    .links(links)
    .size([width, height])
    .linkDistance(100)
    .charge(-200)
    .chargeDistance(-100)
    .on("tick", tick)
    .start();


var scale = d3.scale.linear().domain(d3.extent(nodes, function(d) { return d.count; })).range([10,20]);
var lScale = d3.scale.linear().domain(d3.extent(links, function(d) {     
    return d.probability;
  })).range([0.3,1]);

var wScaleProb = d3.scale.linear().domain([0,1]).range([1,8]);

var svg;

if(location==1){
 svg = d3.select("#markovvis1").append("svg")
    .attr("width", width)
    .attr("height", height);
}else if(location==2){
 svg = d3.select("#markovviz").append("svg")
    .attr("width", width)
    .attr("height", height);
}

var path = svg.append("g").selectAll("path")
    .data(force.links())
  .enter().append("path")
    .attr("class", function(d) { return "link "; })
    .style("opacity",function(d){
      return lScale(d.probability);              
    }).style("stroke-width",function(d){
      //console.log(d.probability)
      return wScaleProb(sigmoid(d.probability,10));            
    });    
console.log(force.links())
var circle = svg.append("g").selectAll("circle")
    .data(force.nodes())
    .enter()
    .append("circle")
    .style("fill",function(){
      return "#1f77b4"      
    })
    .attr("r", function(d){
      return scale(d.count);
    })
    .call(force.drag)
    .on("mouseover",function(d){
        var nodesToShow = [];
        path.style("opacity",function(i){
          if(i.source.name!=d.name){
            return 0;
          }else{
            nodesToShow.push(i.target.name);
            return lScale(i.probability);                
          }
        });
        circle.style("opacity",function(i){
          if((objectIsInList(i.name,nodesToShow)==1) || i==d){
            return 1;
          }else{
            return 0.1;
          }
        });      

        d3.selectAll(".label").style("opacity",function(i){
          if(objectIsInList(i.name,nodesToShow)==1){
            return 1;
          }else{
            return 0.1;
          }
        });   

        d3.selectAll(".edgeLabel").style("opacity",function(i){
          if(objectIsInList(i.target.name,nodesToShow)==1){
            return 1;
          }else{
            return 0;
          }
        });   


        svg.selectAll(".tempLabel")
        .data(force.nodes())
        .enter().append("text")
        .attr("class","tempLabel")
        .attr("x", function(i){
          if(objectIsInList(i.name,nodesToShow)==1){
            if(nodelist.indexOf(i.name)<nodelist.indexOf(d.name)){//parseInt(i.name)<parseInt(d.name)){
              return i.x;
            }else{
              return i.x;
            }
          }
        })
        .attr("y", function(i){
          if(objectIsInList(i.name,nodesToShow)==1){
            if(nodelist.indexOf(i.name)<nodelist.indexOf(d.name)){//parseInt(i.name)<parseInt(d.name)){
              return i.y-30;
            }else if(nodelist.indexOf(i.name)<nodelist.indexOf(d.name)){//parseInt(i.name)>parseInt(d.name)){
              return i.y+35;
            }else{
              return i.y+35;
            }
          }
        })
        .style("fill","black")
        .text(function(i) {
          if(objectIsInList(i.name,nodesToShow)==1){
            var returnText ;
            returnText = (getProbability(d.name,i.name)*d.count)+" ("+(getProbability(d.name,i.name)*100).toFixed(2)+"%)";            
            console.log(returnText)
            return returnText;
          }
        });
    })
    .on("mouseout",function(){
      circle.style("opacity",1);
      d3.selectAll(".label").style("opacity",1);
      d3.selectAll(".tempLabel").remove();
      d3.selectAll(".edgeLabel").style("opacity",0);
      path.style("opacity",function(d){
        return lScale(d.probability);        
      });      
    });

var text = svg.append("g").selectAll("text")
    .data(force.nodes())
    .enter()
    .append("text")
    .attr("class","label")
    .attr("x", 10.5)
    .attr("y", ".31em")
    .style("fill","black")
    .style("font-size",15)
    .text(function(d) { return d.name; });

function transform(d) {
  return "translate(" + d.x + "," + d.y + ")";
}

function linkArc(d) {
  var x1 = d.source.x,
          y1 = d.source.y,
          x2 = d.target.x,
          y2 = d.target.y,
          dx = x2 - x1,
          dy = y2 - y1,
          dr = Math.sqrt(dx * dx + dy * dy),
          drx = dr-25,
          dry = dr,
          xRotation = 0,
          largeArc = 0,
          sweep = 1;
          //console.log(x1,x2,y1,y2)
          
          // Self edge.
          if ( x1 === x2 && y1 === y2 ) {
            xRotation = 45;

            largeArc = 1;

            drx = 25;
            dry = 20;
            
            x2 = x2 + 1;
            y2 = y2 + 1;                      
          } 

     return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2;
     
}

function tick() {
  path.attr("d", linkArc);
  circle.attr("transform", transform);
  text.attr("transform", transform);  
}
  
}