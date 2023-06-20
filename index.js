
var dps = [];
var company = null;
var symbol = null;
var chart = null;
var columns = ["Date", "Open", "High", "Low", "Close", "Adjusted Close", "Volume"];
var data1 = []






var api = "YLDIUB2XA5L83L4H";
// https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&outputsize=full&apikey=YLDIUB2XA5L83L4H
// https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=TSCO.LON&outputsize=full&apikey=demo



const chartProperties = {
  width: 1400,
  height: 400,
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
  },
  layout:{
    right:500,
  },
 
}


function download(){
  window.location = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol="+symbol+"&outputsize=full&apikey="+api+"&datatype=csv";
}
function candleStick(){

const domElement = document.getElementById('tvchart');
const c_chart = LightweightCharts.createChart(domElement, chartProperties);
const candleSeries = c_chart.addCandlestickSeries();
  fetch("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=" + symbol + "&outputsize=full&apikey=" + api)
  .then(res => res.json())
  .then(data => {
    const timeSeries = data['Time Series (Daily)'];
    const cdata = Object.keys(timeSeries).map(key => {
        
      const d = timeSeries[key];
    //   console.log(d);
      return {
        time: new Date(key).getTime() / 1000,
        open: parseFloat(d['1. open']),
        high: parseFloat(d['2. high']),
        low: parseFloat(d['3. low']),
        close: parseFloat(d['4. close']),
      };
    });
    const sortedData = cdata.sort((a, b) => a.time - b.time);
    console.log(sortedData);
    candleSeries.setData(sortedData);
    
    
    candleSeries.setData(cdata);
  })
  .catch(err => console.log(err));




}
function getting_data(){
  if(company !== null){
    $.getJSON("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol="+symbol+"&outputsize=full&apikey="+api)
    .done(function(data){
      var date = data["Time Series (Daily)"]
      let a = 20;
      let b = 7;
      for(var d in date){
        var r = d.split("-");
        if(a-- > 0){
          var value = date[d];
          dps.unshift({x: new Date(parseInt(r[0]), parseInt(r[1])-1, parseInt(r[2])), y: parseFloat(value["1. open"])});
          if(b-- > 0){
            let c = [d, value["1. open"], value["2. high"], value["3. low"], value["4. close"], value["5. adjusted close"], value["6. volume"]];
            data1.push(c);
          }
        }else{
          break;
        }
      }
      graph();
      drawTable();
      document.getElementById("loading_container").style.display = "none";
      var div = document.querySelector('#table_container');
div.classList.remove('hidden');
div.classList.add('visible');
      
      document.getElementById("download_data").style.display = "block";
      document.getElementById("companies").disabled = false;
      document.getElementById("get_data").disabled = false;
      document.getElementById("chartContainer").disabled = false;
      
      candleStick();
     
    })
    .fail(function(textStatus, error){
      alert(textStatus+" "+error+"\nReload the page");
    })
  }
}


function graph(){
  chart = new CanvasJS.Chart("chartContainer", {
    title:{
      text: company
    },
    animationEnabled: true,
    theme: "light2",
    axisY:{
      title: "Open Prices",
      includeZero: false
    },
    axisX:{
      title: "Date",
      valueFormatString: "DD-MMM"
    },
    data: [{        
      type: "line",
          indexLabelFontSize: 16,
      dataPoints: dps
    }]
  });
  chart.options.data[0].dataPoints = dps;
  chart.render();
}

function getData(){
  if(chart !== null){
    chart.destroy();
  }
  data1 = [];
  dps = [];
  
  company = document.getElementById("companies").value;
  let r = company.split("(");
  symbol = r[1].substring(0, r[1].length-1);
  document.getElementById("loading_container").style.display = "block";
  document.getElementById("download_data").style.display = "none";
  document.getElementById("companies").disabled = true;
  document.getElementById("get_data").disabled = true;
  document.getElementById("chartContainer").disabled = true;
  // document.getElementById("tvchart").style.display =" ";
  getting_data();
}

// function drawTable(){
//   var table_container = document.getElementById("table_container");
//   var para = document.createElement("p");
//   para.id = "para";
//   var cell = document.createTextNode("RECENT END OF DAY PRICES");
//   para.appendChild(cell);
//   table_container.appendChild(para);
//   var table = document.createElement("table");
//   table.className = "table";
//   var row = document.createElement("tr");
//   for(let i=0;i<columns.length;i++){
//     var col = document.createElement("th");
//     col.scope = "col";
//     cell = document.createTextNode(columns[i]);
//     col.appendChild(cell);
//     row.appendChild(col);
//   }
//   table.appendChild(row);
//   for(let i=0;i<7;i++){
//     row = document.createElement("tr");
//     for(let j=0;j<7;j++){
//       col = document.createElement("td");
//       cell = document.createTextNode(data1[i][j]);
//       col.appendChild(cell);
//       row.appendChild(col);
//     }
//     table.appendChild(row);
//   }
//   table_container.appendChild(table);
// }

function drawTable() {
  var table_container = document.getElementById("table_container");

  // create heading element
  var heading = document.createElement("h2");
  heading.textContent = "Recent End of Day Prices";
  table_container.appendChild(heading);

  // create table element
  var table = document.createElement("table");
  table.classList.add("table");

  // create table header row
  var header_row = document.createElement("tr");
  for (let i = 0; i < columns.length; i++) {
    var header_cell = document.createElement("th");
    header_cell.textContent = columns[i];
    header_row.appendChild(header_cell);
  }
  table.appendChild(header_row);

  // create table data rows
  for (let i = 0; i < data1.length; i++) {
    var data_row = document.createElement("tr");
    for (let j = 0; j < data1[i].length; j++) {
      var data_cell = document.createElement("td");
      data_cell.textContent = data1[i][j];
      data_row.appendChild(data_cell);
    }
    table.appendChild(data_row);
  }

  // add table to container
  table_container.appendChild(table);
}