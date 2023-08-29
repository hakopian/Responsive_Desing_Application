"use strict";
        
// default query values
let state       = "AL"
let sex         = "girl"
let year        = "1960"
let queryString = ""
let names               = []
let numbers             = []
let chartTitle          = ""
let chartCanvas         = undefined
let chartContext        = undefined
let myChart             = undefined


if (window.cordova) {
    /* will only be true of cordova.js is loaded, which means running on phone
    /* wait until cordova is loaded, it will call onDeviceReady*/
    document.addEventListener("deviceready", initialize, false);
} else {
    // running in a browser to test/develop
    initialize();
}

chartCanvas  = document.getElementById('chartCanvasId')
chartContext = chartCanvas.getContext('2d')


function initialize() {
    updateQueryString()
    createChart()
    runQuery()
}    

function updateState(value) { 
    state = value 
    updateQueryString()
    runQuery()
}

function updateSex(value)   { 
    sex = value 
    updateQueryString()
    runQuery()
}

function updateYear(value)  { 
    year = value 
    updateQueryString()
    runQuery()
}

function updateQueryString() {
    queryString = 

      "SELECT name, number, state, sex, year \n" 
    + "FROM   NamesNumberByStateYear \n"
    + "WHERE\n "
    + " state = "    + "'" + state   + "'"
    + " AND sex = "  + "'" + sex     + "'"
    + " AND year = " + "'" + year    + "'\n"
    + "ORDER BY number DESC LIMIT 5;"
    document.getElementById('queryStingId').innerHTML = queryString;
}

function runQuery() {
    MySql.Execute(
        "sql.wpc-is.online",	// mySQL server
        "demo", 				// login name
        "demo12345", 			// login password
        "BabyNames", 			// database to use
                                // SQL query string:
        
        queryString,
        function (data) {
            processQueryResult(data);
        }
    );
}

function processQueryResult(queryReturned) {
    if (!queryReturned.Success) {
        alert(queryReturned.Error)
    } else {
        const data = queryReturned.Result;
        names = []
        numbers = []
            for (let i=0; i<data.length;i++) {
                names.push(data[i].name) 
                numbers.push(data[i].number)
            }

            updateChart()
        
            
            //console.log(names)
            //console.log(numbers)
    }
}

function createChart() {
    chartCanvas = document.getElementById('chartCanvasId');
    chartContext = chartCanvas.getContext('2d');
    
    myChart = new Chart(chartContext, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: "Most Popular " + sex + " names from " + state + " in " + year,
                data: [],
                backgroundColor: [
                    'rgba(0, 0, 255, 0.5)', 
                    'rgba(255, 0, 0, 0.5)',
                    'rgba(255, 255, 255, 0.5)', 
                    'rgba(255, 255, 0, 0.5)', 
                    'rgba(0, 128, 0, 0.5)', 
                ],
                borderColor: 'rgba(128, 128, 128, 1)', 
                borderWidth: 2, 
            }]
        },
        options: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: chartTitle,
                fontSize: 16, 
                fontColor: 'black',
                fontStyle: 'bold', 
                
                
            },
            responsive: true,
            maintainAspectRatio: false
        }
    })
}

function updateChart() {
    if (myChart) {
        myChart.data.labels = names
        myChart.data.datasets[0].data = numbers
        myChart.options.title.text = "Most Popular " + sex + " names from " + state + " in " + year
        myChart.update()
    }
}
