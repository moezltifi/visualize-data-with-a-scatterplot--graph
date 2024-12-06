const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

fetch(url)
  .then(response => response.json())
  .then(data => {
    const width = 800;
    const height = 400;
    const padding = 50;

    const svg = d3.select("#chart-area")
                  .attr("width", width + padding * 2)
                  .attr("height", height + padding * 2);

    const xScale = d3.scaleTime()
                     .domain([d3.min(data, d => new Date(d.Year - 1, 0)), d3.max(data, d => new Date(d.Year + 1, 0))])
                     .range([padding, width + padding]);

    const yScale = d3.scaleTime()
                     .domain([d3.min(data, d => new Date(1970, 0, 1, 0, Math.floor(d.Seconds / 60), d.Seconds % 60)),
                              d3.max(data, d => new Date(1970, 0, 1, 0, Math.floor(d.Seconds / 60), d.Seconds % 60))])
                     .range([padding, height + padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    svg.append("g")
       .attr("id", "x-axis")
       .attr("transform", `translate(0, ${height + padding})`)
       .call(xAxis);

    svg.append("g")
       .attr("id", "y-axis")
       .attr("transform", `translate(${padding}, 0)`)
       .call(yAxis);

    svg.selectAll(".dot")
       .data(data)
       .enter()
       .append("circle")
       .attr("class", "dot")
       .attr("cx", d => xScale(new Date(d.Year, 0)))
       .attr("cy", d => yScale(new Date(1970, 0, 1, 0, Math.floor(d.Seconds / 60), d.Seconds % 60)))
       .attr("r", 5)
       .attr("data-xvalue", d => d.Year)
       .attr("data-yvalue", d => new Date(1970, 0, 1, 0, Math.floor(d.Seconds / 60), d.Seconds % 60))
       .on("mouseover", function(event, d) {
         const tooltip = d3.select("#tooltip");
         tooltip.style("visibility", "visible")
                .style("top", `${event.pageY}px`)
                .style("left", `${event.pageX + 10}px`)
                .attr("data-year", d.Year)
                .html(`Year: ${d.Year}<br>Time: ${d.Time}<br>${d.Doping ? `Doping: ${d.Doping}` : "No doping"}`);
       })
       .on("mouseout", () => {
         d3.select("#tooltip").style("visibility", "hidden");
       });

    const legend = d3.select("#legend");
    legend.append("div").html("<span style='background-color: steelblue; display: inline-block; width: 12px; height: 12px; margin-right: 5px;'></span> No doping allegations");
    legend.append("div").html("<span style='background-color: orange; display: inline-block; width: 12px; height: 12px; margin-right: 5px;'></span> Doping allegations");
  });