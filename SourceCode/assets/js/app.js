//Storing width and height parameters 
var svgWidth = 900;
var svgHeight = 600;

// Setting svg margins 
var margin = {
  top: 40,
  right: 40,
  bottom: 80,
  left: 90
};

// parameters set to fit chart within canvas
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var csvfile = "assets/data/data.csv";

// Function is called and passes csv data
d3.csv(csvfile).then(success, error);


// If error exist it is thrown here
function error(errormsg) {
  throw errormsg;
}

// Function takes in argument healthData
function success(healthData) {

  // Loop through the data fetch necessary parameters
  healthData.map(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  //  Create scale functions
  // Linear Scale takes the min to be displayed in axis, and the max of the data
  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(healthData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([3, d3.max(healthData, d => d.healthcare)])
    .range([height, 0]);

  var bottomAxis = d3.axisBottom(xLinearScale) 
    .ticks(7);
  var leftAxis = d3.axisLeft(yLinearScale);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  
  chartGroup.append("g")
    .call(leftAxis);


  // CreatingCircles for scatter plot
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "13")
    .attr("fill", "#788dc2")
    .attr("opacity", ".75")


  // Append text to circles 

  circlesGroup = chartGroup.selectAll()
    .data(healthData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .style("font-size", "13px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr));

  // Step 6: Initialize tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}% `);
    });

  // Step 7: Create tooltip in the chart
  chartGroup.call(toolTip);

 //onmouseover event
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

  // axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
}