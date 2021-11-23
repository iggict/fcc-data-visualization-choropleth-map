/** Size */

const margin = {
  top: 110,
  right: 20,
  bottom: 80,
  left: 10,
};

/** Load data */

const COUNTY_JSON =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

const EDUCATION_JSON =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

Promise.all([d3.json(COUNTY_JSON),d3.json(EDUCATION_JSON)])
  .then(([countyData, educationData]) => {
    processData(countyData, educationData);
  })
  .catch((err) => console.log(err));

/** Process data */

const processData = (us, education) => {
  
  /**  Parse data */
  
  const bbox = {
    top: us.bbox[0], 
    left: us.bbox[1],
    width: us.bbox[2],
    height: us.bbox[3]
  };
  
  const [width, height] = [bbox.width, bbox.height];
  const parentWidth = width + margin.left + margin.right;
  const parentHeight = height + margin.top + margin.bottom;
  
  const [minBach, maxBach] = d3.extent(education, (d) => d.bachelorsOrHigher);

  const countyPaths = topojson.feature(us, us.objects.counties).features;
  const countyInnerBoundaries = topojson.mesh(us, us.objects.states, (a, b) => a !== b);
  
  /** Color Brewer */

  const numOfColors = 9;
  const colorRange = d3.schemeOranges[numOfColors];
  const colorScale = d3
    .scaleQuantize()
    .domain([minBach, maxBach])
    .range(colorRange);

  /** Draw map */

  // D3 element for map
  
  const map = d3
    .select("body")
    .append("div")
    .attr("class", "container")
    .append("svg")
    .attr("id", "map")
    .attr("class", "map")
    .attr("width", parentWidth)
    .attr("height", parentHeight)
    //.attr("preserveAspectRatio", "xMinYMin meet")
    //.attr("viewBox", `0 0 ${parentWidth} ${parentHeight}`);
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Headers

  const title = map
    .append("text")
    .attr("id", "title")
    .attr("class", "title")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2 - 5)
    .text("US Education by County (2010-2014)");

  const subtitle = map
    .append("text")
    .attr("id", "description")
    .attr("class", "subtitle")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2 + 30)
    .text("% of 25-year-old citizens (or older) with a bachelor's degree (or higher)");
  
  // Tooltip

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .attr("class", "tooltip")
  ;  
  
  // Set counties
  
  const getEducationByCounty = (countyId) => {
    return education.filter((item) => (item.fips === countyId))[0]
  };
  
  const getCountyBachelors = (countyId) => {
    return getEducationByCounty(countyId).bachelorsOrHigher
  };
  
  map
    .append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(countyPaths)
    .enter()
    .append("path")
    .attr("class", "county")
    .attr("data-fips", d => d.id)
    .attr('data-education', d => getCountyBachelors(d.id))
    .attr("fill", d => colorScale(getCountyBachelors(d.id)))
    .attr("d", d3.geoPath())
    .on("mouseover", (event, d) => {

      const [xTooltipMargin, yTooltipMargin] = [20, -40];
    
      const tooltipInnerHtml = (item) => (
        ` <hr class="tt-color" 
             style="border-color: ${colorScale(item.bachelorsOrHigher)}"/>
             <span class="tt-county">${item.area_name}</span>, 
         <span class="tt-state">${item.state}</span>.
         <br />
         <span class="tt-bachelor">${item.bachelorsOrHigher}%</span>`
      );
    
      tooltip
        .transition().duration(300).style("opacity", 0.9);
      
      tooltip
        .style("top", (event.pageY || event.y) + yTooltipMargin + "px")
        .style("left", (event.pageX || event.x) + xTooltipMargin + "px")
        .attr("data-education", getCountyBachelors(d.id))
        .html(tooltipInnerHtml(getEducationByCounty(d.id)));
    })
    .on("mouseout", () => {
      tooltip.transition().duration(300).style("opacity", 0);
  });

  // Set states
  
  map
    .append('path')
    .attr('class', 'states')
    .datum(countyInnerBoundaries)
    .attr('d', d3.geoPath());  
  
  /** Draw legend */
      
  const legendItemWidth = 30;
  const legendWidth = colorRange.length * legendItemWidth;

  // Legend

  const legendTop = parentHeight - margin.top - legendItemWidth * 2;
  const legendLeft = parentWidth / 2 - legendItemWidth * numOfColors /2;

  const legend = map
  .append("g")
  .attr("id", "legend")
  .attr("class", "legend")
  .append("g")
  .attr("transform",`translate(${legendLeft},${legendTop})`); 

  legend
    .selectAll("rect")
    .data(colorRange)
    .enter()
    .append("rect")
    .classed("legend-item", true)
    .style("fill", d => d)
    .attr("x", (d, i) => (legendItemWidth * i))
    .attr("y", 0)
    .attr("width", legendItemWidth)
    .attr("height", legendItemWidth);

  // Legend scale

  const legendXScale = d3
  .scaleLinear()
  .domain([minBach, maxBach])
  .range([0, legendWidth]);

  // Legend axis

  const createDomain = (min, max, length) => {
    const base = min;
    const step = (max - min) / length;
    const array = [base];
    for (let i = 0; i <= length; i++) {
      array.push (base + i * step);
    }
    return array;
  };

  const legendXDomain = createDomain(minBach, maxBach, colorRange.length);

  const legendXAxis = map
  .append("g")
  .attr("id", "legend-x-axis")
  .attr("class", "axis legend-x-axis")
  .attr("transform", `translate(${legendLeft}, ${legendTop + legendItemWidth})`);

  legendXAxis.call(d3
    .axisBottom(legendXScale)
    .tickValues(legendXDomain)
    .tickFormat(d3.format('.1f'))
  );

}

