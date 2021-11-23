/** Size */

const margin = {
  top: 110,
  right: 20,
  bottom: 20,
  left: 0,
};

// Note: The width and height of the map are taken from the bbox property of counties.json 

const parentWidth = (w) => w + margin.left + margin.right;
const parentHeight = (h) => h + margin.top + margin.bottom;

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
  // console.log(us);
  // console.log(education);
  
  /**  Parse data */
  
  const bbox = {
    top: us.bbox[0], 
    left: us.bbox[1],
    width: us.bbox[2],
    height: us.bbox[3]
  };
  
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
    .attr("width", parentWidth(bbox.width))
    .attr("height", parentHeight(bbox.height))
    //.attr("preserveAspectRatio", "xMinYMin meet")
    //.attr("viewBox", `0 0 ${parentWidth} ${parentHeight}`);
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Headers

  const title = map
    .append("text")
    .attr("id", "title")
    .attr("class", "title")
    .attr("x", bbox.width / 2)
    .attr("y", -margin.top / 2 - 5)
    .text("US Education by County (2010-2014)");

  const subtitle = map
    .append("text")
    .attr("id", "description")
    .attr("class", "subtitle")
    .attr("x", bbox.width / 2)
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

      console.log(d);
    
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

}

