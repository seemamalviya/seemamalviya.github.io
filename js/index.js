var mpgTab = new bootstrap.Tab(document.querySelector('#mpg'))
var dimensionsTab = new bootstrap.Tab(document.querySelector('#dimensions'))
var engineTab = new bootstrap.Tab(document.querySelector('#engine'))

// Chart dot colors
colorOne = "#012749";
colorTwo = "#fa4d56";
colorThree = "#a56eff";
colorFour = "#3ddbd9";
colorFive = "#ffc107";


const carBodyColor = d3.scaleOrdinal()
    .domain(["convertible", "hatchback", "sedan", "wagon", "hardtop"])
    .range([colorOne, colorTwo, colorThree, colorFour, colorFive])


// Value is an array of: [color scale function, column in the dataset]
colorMap = {   
    'bodyStyle': [carBodyColor, 'carbody'],    
}

function writeMpgCharts(data) {
    document.getElementById("chart-mpg1").innerHTML = "";
    document.getElementById("chart-mpg2").innerHTML = "";
    renderMpgChart(data);
}
function writeDimensionCharts(data) {
    document.getElementById("chart-dim1").innerHTML = "";
    document.getElementById("chart-dim2").innerHTML = "";
    document.getElementById("chart-dim4").innerHTML = "";
    renderDimensionChart(data);
}
function writeEngineCharts(data) {
    document.getElementById("chart-eng1").innerHTML = "";
    document.getElementById("chart-eng4").innerHTML = "";
    renderEngineChart(data);
}

d3.csv("data/car_prices.csv").then(function (data) {
    // Render initial chart
    renderMpgChart(data);

    // Event listener for trait selector
    var tabElms = document.querySelectorAll('a[data-bs-toggle="list"]')
    tabElms.forEach(function (tabElm) {
        tabElm.addEventListener('shown.bs.tab', function (event) {
            switch (event.target.getAttribute("id")) {
                case 'mpg':
                    writeMpgCharts(data);
                    break;
                case 'dimensions':
                    writeDimensionCharts(data);
                    break;
                case 'engine':
                    writeEngineCharts(data);
                    break;
                default:
                    break;
            }
        })
    });

    // Event listener for color
    document.getElementById('colorSelect').addEventListener('change', function () {
        switch (this.value) {
            case 'bodyStyle':
                document.getElementById('selectPills').innerHTML = `
                <div><span class="badge rounded-pill" style="background-color: ${colorOne};">Convertible</span></div>
                <div><span class="badge rounded-pill" style="background-color: ${colorTwo};">Hatchback</span></div>
                <div><span class="badge rounded-pill" style="background-color: ${colorThree};">Sedan</span></div>
                <div><span class="badge rounded-pill text-dark" style="background-color: ${colorFour};">Wagon</span></div>
                <div><span class="badge rounded-pill" style="background-color: ${colorFive};">Hardtop</span></div>
                `;
                break;
            default:
                break;
        }

        writeMpgCharts(data);
        writeDimensionCharts(data);
        writeEngineCharts(data);
    });
})


function renderMpgChart(data) {
    mpg1tooltip = d3.select("#chart-mpg1")
        .append("div")
        .attr("class", "tooltip")
    mpg1tooltipmouseover = function (event, d) { mpg1tooltip.style("opacity", .65) }
    mpg1tooltipmousemove = function (event, d) {
        mpg1tooltip
            .html(d.CarName)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 50) + "px")
    }
    mpg1tooltipmouseleave = function (event, d) {
        mpg1tooltip
            .transition()
            .duration(500)
        mpg1tooltip.style("opacity", 0)
    };
    mpg2tooltip = d3.select("#chart-mpg2")
        .append("div")
        .attr("class", "tooltip")
    mpg2tooltipmouseover = function (event, d) { mpg2tooltip.style("opacity", .65) }
    mpg2tooltipmousemove = function (event, d) {
        mpg2tooltip
            .html(d.CarName)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 50) + "px")
    }
    mpg2tooltipmouseleave = function (event, d) {
        mpg2tooltip
            .transition()
            .duration(500)
        mpg2tooltip.style("opacity", 0)
    };

    mpg1annotations = d3.annotation()
        .annotations([{
            note: {
                label: "Negatively correlated to price.",
            },
            x: 200,
            y: 150,
            dy: -70,
            dx: 50
        }])
    mpg2annotations = d3.annotation()
        .annotations([{
            note: {
                label: "Negatively correlated to price.",
            },
            x: 200,
            y: 150,
            dy: -70,
            dx: 50
        }])

    colorPair = colorMap[document.getElementById("colorSelect").value]
    margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    svg1 = d3.select("#chart-mpg1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    x1 = d3.scaleLinear()
        .domain([10, 55])
        .range([0, width]);
    svg1.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x1))
    y1 = d3.scaleLinear()
        .domain([0, 50000])
        .range([height, 0]);
    svg1.append("g")
        .call(d3.axisLeft(y1));
    svg1.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("cx", function (d) { return x1(d.citympg); })
        .attr("cy", function (d) { return y1(d.price); })
        .attr("r", 4)
        .style("fill", function name(d) { return colorPair[0](d[colorPair[1]]) })
        .on("mouseover", mpg1tooltipmouseover)
        .on("mousemove", mpg1tooltipmousemove)
        .on("mouseleave", mpg1tooltipmouseleave)
    svg1.append("g").call(mpg1annotations)



    svg2 = d3.select("#chart-mpg2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    x2 = d3.scaleLinear()
        .domain([10, 55])
        .range([0, width]);
    svg2.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x2))
    y2 = d3.scaleLinear()
        .domain([0, 50000])
        .range([height, 0]);
    svg2.append("g")
        .call(d3.axisLeft(y2));
    svg2.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("cx", function (d) { return x2(d.highwaympg); })
        .attr("cy", function (d) { return y2(d.price); })
        .attr("r", 4)
        .style("fill", function name(d) { return colorPair[0](d[colorPair[1]]) })
        .on("mouseover", mpg2tooltipmouseover)
        .on("mousemove", mpg2tooltipmousemove)
        .on("mouseleave", mpg2tooltipmouseleave)
    svg2.append("g").call(mpg2annotations)
}



function renderDimensionChart(data) {
    dim1tooltip = d3.select("#chart-dim1")
        .append("div")
        .attr("class", "tooltip")
    dim1tooltipmouseover = function (event, d) { dim1tooltip.style("opacity", .65) }
    dim1tooltipmousemove = function (event, d) {
        dim1tooltip
            .html(d.CarName)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 50) + "px")
    }
    dim1tooltipmouseleave = function (event, d) {
        dim1tooltip
            .transition()
            .duration(500)
        dim1tooltip.style("opacity", 0)
    };
    dim2tooltip = d3.select("#chart-dim2")
        .append("div")
        .attr("class", "tooltip")
    dim2tooltipmouseover = function (event, d) { dim2tooltip.style("opacity", .65) }
    dim2tooltipmousemove = function (event, d) {
        dim2tooltip
            .html(d.CarName)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 50) + "px")
    }
    dim2tooltipmouseleave = function (event, d) {
        dim2tooltip
            .transition()
            .duration(500)
        dim2tooltip.style("opacity", 0)
    };
    
    dim4tooltip = d3.select("#chart-dim4")
        .append("div")
        .attr("class", "tooltip")
    dim4tooltipmouseover = function (event, d) { dim4tooltip.style("opacity", .65) }
    dim4tooltipmousemove = function (event, d) {
        dim4tooltip
            .html(d.CarName)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 50) + "px")
    }
    dim4tooltipmouseleave = function (event, d) {
        dim4tooltip
            .transition()
            .duration(500)
        dim4tooltip.style("opacity", 0)
    };


    dim1annotations = d3.annotation()
        .annotations([{
            note: {
                label: "Positively correlated to price.",
            },
            x: 150,
            y: 100,
            dy: -30,
            dx: -50
        }])
    dim2annotations = d3.annotation()
        .annotations([{
            note: {
                label: "Positively correlated to price.",
            },
            x: 150,
            y: 100,
            dy: -30,
            dx: -50
        }])
    dim4annotations = d3.annotation()
        .annotations([{
            note: {
                label: "No strong correlation to price.",
            },
            x: 150,
            y: 100,
            dy: -30,
            dx: -50
        }])

    margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 350 - margin.left - margin.right,
        height = 225 - margin.top - margin.bottom;

    svg1 = d3.select("#chart-dim1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    x1 = d3.scaleLinear()
        .domain([60, 125])
        .range([0, width]);
    svg1.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x1))
    y1 = d3.scaleLinear()
        .domain([0, 50000])
        .range([height, 0]);
    svg1.append("g")
        .call(d3.axisLeft(y1));
    svg1.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("cx", function (d) { return x1(d.wheelbase); })
        .attr("cy", function (d) { return y1(d.price); })
        .attr("r", 4)
        .style("fill", function name(d) { return colorPair[0](d[colorPair[1]]) })
        .on("mouseover", dim1tooltipmouseover)
        .on("mousemove", dim1tooltipmousemove)
        .on("mouseleave", dim1tooltipmouseleave)
    svg1.append("g").call(dim1annotations)

    svg2 = d3.select("#chart-dim2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    x2 = d3.scaleLinear()
        .domain([130, 220])
        .range([0, width]);
    svg2.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x2))
    y2 = d3.scaleLinear()
        .domain([0, 50000])
        .range([height, 0]);
    svg2.append("g")
        .call(d3.axisLeft(y2));
    svg2.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("cx", function (d) { return x2(d.carlength); })
        .attr("cy", function (d) { return y2(d.price); })
        .attr("r", 4)
        .style("fill", function name(d) { return colorPair[0](d[colorPair[1]]) })
        .on("mouseover", dim2tooltipmouseover)
        .on("mousemove", dim2tooltipmousemove)
        .on("mouseleave", dim2tooltipmouseleave)
    svg2.append("g").call(dim2annotations)

    svg4 = d3.select("#chart-dim4")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    x4 = d3.scaleLinear()
        .domain([38, 62])
        .range([0, width]);
    svg4.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x4))
    y4 = d3.scaleLinear()
        .domain([0, 50000])
        .range([height, 0]);
    svg4.append("g")
        .call(d3.axisLeft(y4));
    svg4.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("cx", function (d) { return x4(d.carheight); })
        .attr("cy", function (d) { return y4(d.price); })
        .attr("r", 4)
        .style("fill", function name(d) { return colorPair[0](d[colorPair[1]]) })
        .on("mouseover", dim4tooltipmouseover)
        .on("mousemove", dim4tooltipmousemove)
        .on("mouseleave", dim4tooltipmouseleave)
    svg4.append("g").call(dim4annotations)

}


function renderEngineChart(data) {
    eng1tooltip = d3.select("#chart-eng1")
        .append("div")
        .attr("class", "tooltip")
    eng1tooltipmouseover = function (event, d) { eng1tooltip.style("opacity", .65) }
    eng1tooltipmousemove = function (event, d) {
        eng1tooltip
            .html(d.CarName)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 50) + "px")
    }
    eng1tooltipmouseleave = function (event, d) {
        eng1tooltip
            .transition()
            .duration(500)
        eng1tooltip.style("opacity", 0)
    };
    
    eng4tooltip = d3.select("#chart-eng4")
        .append("div")
        .attr("class", "tooltip")
    eng4tooltipmouseover = function (event, d) { eng4tooltip.style("opacity", .65) }
    eng4tooltipmousemove = function (event, d) {
        eng4tooltip
            .html(d.CarName)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 50) + "px")
    }
    eng4tooltipmouseleave = function (event, d) {
        eng4tooltip
            .transition()
            .duration(500)
        eng4tooltip.style("opacity", 0)
    };

    eng1annotations = d3.annotation()
        .annotations([{
            note: {
                label: "Positively correlated to price.",
            },
            x: 165,
            y: 150,
            dy: 40,
            dx: 90
        }])
    eng2annotations = d3.annotation()
        .annotations([{
            note: {
                label: "No strong correlation to price.",
            },
            x: 130,
            y: 160,
            dy: -90,
            dx: 90
        }])
    eng3annotations = d3.annotation()
        .annotations([{
            note: {
                label: "No strong correlation to price.",
            },
            x: 230,
            y: 150,
            dy: -45,
            dx: -90
        }])
    eng4annotations = d3.annotation()
        .annotations([{
            note: {
                label: "Positively correlated to price.",
            },
            x: 165,
            y: 150,
            dy: 20,
            dx: 90
        }])
    margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    svg1 = d3.select("#chart-eng1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    x1 = d3.scaleLinear()
        .domain([0, 350])
        .range([0, width]);
    svg1.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x1))
    y1 = d3.scaleLinear()
        .domain([0, 50000])
        .range([height, 0]);
    svg1.append("g")
        .call(d3.axisLeft(y1));
    svg1.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("cx", function (d) { return x1(d.horsepower); })
        .attr("cy", function (d) { return y1(d.price); })
        .attr("r", 4)
        .style("fill", function name(d) { return colorPair[0](d[colorPair[1]]) })
        .on("mouseover", eng1tooltipmouseover)
        .on("mousemove", eng1tooltipmousemove)
        .on("mouseleave", eng1tooltipmouseleave)
    svg1.append("g").call(eng1annotations)

    svg4 = d3.select("#chart-eng4")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    x4 = d3.scaleLinear()
        .domain([0, 400])
        .range([0, width]);
    svg4.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x4))
    y4 = d3.scaleLinear()
        .domain([0, 50000])
        .range([height, 0]);
    svg4.append("g")
        .call(d3.axisLeft(y4));
    svg4.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("cx", function (d) { return x4(d.enginesize); })
        .attr("cy", function (d) { return y4(d.price); })
        .attr("r", 4)
        .style("fill", function name(d) { return colorPair[0](d[colorPair[1]]) })
        .on("mouseover", eng4tooltipmouseover)
        .on("mousemove", eng4tooltipmousemove)
        .on("mouseleave", eng4tooltipmouseleave)
    svg4.append("g").call(eng4annotations)

}
