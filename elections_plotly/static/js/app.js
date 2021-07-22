// DEFAULT ID
var defaultID = 19001;

// ENDPOINTS
var link_id = "../../../cleaning/output/id_municipios.json";
var link_a2015 = "../../../cleaning/output/resultados_a2015.json";
var link_a2018 = "../../../cleaning/output/resultados_a2018.json";
var link_a2021 = "../../../cleaning/output/resultados_a2021.json";
var link;

// SELECT HTML ELEMENTS
var title = d3.select("#nombre-municipio");
var dropdown = d3.select("#selMunicipio");
var resultsInfo = d3.select("#election-results");

// RENDER DROPDOWN FUNCTION
function renderDrowpdown(municipios, ids) {
    for (var i = 0; i < municipios.length; i++) {
        dropdown.append('option').text(municipios[i]).attr("value", (ids[i]));
    }
}

// RENDER TITLE FUNCTION
function renderTitle(id_municipio) {

    d3.json(link_id).then((id_data) => {
        var rowMunicipio = id_data.find((d) => d.ID === id_municipio);
        title.html("").append('p').text(`Municipio ${rowMunicipio.ID}: ${rowMunicipio.Municipio}`);
    });
}

// RENDER RESULTS FUNCTION
function renderResults(municipio) {
    ganador = municipio.Ganador
    console.log(ganador);
    resultsInfo.html("")
        .append('p').text(`Ganador: ${ganador}`)
        .append('p').text(`Votos: ${municipio[ganador]}`)
        .append('p').text(`${Math.round((municipio[ganador] / municipio.Total * 100), 2)}%`)
    //         .style('font-size', '11.5px')
    //         .style('font-weight', 'bold');
}

// RENDER CHART.JS
function renderChartJS(x, y, year) {

    // Pending: choose pretty colors & alpha
    var color = ['blue', 'red', 'orange', 'brown', 'gray'];

    var chart2015 = document.getElementById("chart-2015").getContext('2d');
    var chart2018 = document.getElementById("chart-2018").getContext('2d');
    var chart2021 = document.getElementById("chart-2021").getContext('2d');

    params = {
        type: 'bar',
        data: {
            labels: y,
            datasets: [{
                data: x,
                backgroundColor: color
            }],
        },
        options: {
            indexAxis: 'y',
            plugins: {
                title: {display: true, text: year, font: { size: 25 }},
                legend: { display: false }
            }
        }
    }


if (year === 2015) { results2015 = new Chart(chart2015, params); }
else if (year === 2018) { results2018 = new Chart(chart2018, params); }
else if (year === 2021) { results2021 = new Chart(chart2021, params); }


}

// RENDER YEAR
function renderYear(id_municipio, year) {

    if (year === 2015) { link = link_a2015; text = "2015"; id = "chart-2015" }
    else if (year === 2018) { link = link_a2018; text = "2018"; id = "chart-2018" }
    else if (year === 2021) { link = link_a2021; text = "2021"; id = "chart-2021" }

    d3.json(link).then((year_data) => {

        var rowMunicipio = year_data.find((d) => d.ID === id_municipio);
        var partidos = ['PAN', 'PRI', 'MC', 'MORENA', 'Otro'];
        var x = partidos.map(d => rowMunicipio[d]);
        var y = partidos.map(d => `${d} `);

        // renderChart(x, y, text, id)

        renderChartJS(x, y, year)

        console.log("Municipio:", rowMunicipio.Municipio);
        console.log("Año:", year);
        console.log("X:", x);
        console.log("Y:", y);

    });
}


// RUN FUNCTION
function runEvent(id_municipio) {

    // DROPDOWN
    // Pending: Delete HTML Element
    d3.json(link_id).then((id_data) => {
        console.log("Municipios:", id_data);
        var ids = id_data.map(d => d.ID);
        var municipios = id_data.map(d => d.Municipio);
        console.log("IDs:", ids);
        console.log("Municipios:", municipios);
        renderDrowpdown(municipios, ids);
    });

    renderTitle(id_municipio);
    renderYear(id_municipio, 2015);
    renderYear(id_municipio, 2018);
    renderYear(id_municipio, 2021);

}


// INIT
runEvent(defaultID);

// CHANGE OPTION FUNCTION
function optionChanged() {
    var selectedID = parseInt(dropdown.property('value'));
    console.log("Selected:", selectedID);

    results2015.destroy();
    results2018.destroy();
    results2021.destroy();

    runEvent(selectedID);

}



