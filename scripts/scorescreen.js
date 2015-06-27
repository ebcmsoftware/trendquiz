//this file is a fucking mess 
var i = 0;
console.log("recent scores: " + localStorage['recentscores']);

Number.prototype.readable_num = function() {
  return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

var topscore = Number(localStorage['topscore']);

    (function () {
        $('#scorechart').highcharts({
            tooltip: {
                crosshairs: [{
                    width: 4,
                    color: '#1A4E95'
                }],
                trackByArea: false,
                animation: false,
                backgroundColor: 'white',
                borderColor: '#1A4E95',
                hideDelay:0,
                shared:true,
                style: {
                  color: 'black',
                  fontSize: '1.5em',
                  padding: '8px',
                  fontFamily: 'Source Sans Pro'
                },
                //pointFormat: '%'
                //pointFormat: '<span style = "text-align:center;">{point.y:.0f}%</span>'
            },
            chart: {
                type: 'line',
                animation: true,
                style: {
                    //fontFamily: 'Raleway',
                    fontFamily: 'Source Sans Pro',
                    backgroundColor: 'white'
                },
            reflow: true
            },
            legend: {
                enabled: false
            },
            tooltip: {
                formatter: function() {return '<p class="TQnum !important" style="font-size:2em;">'+this.y+'</p>';},
            },
            title: {
                text: 'Your Scores',
            },
            yAxis: {
                title:'',
                labels:{
                    style: {
                        fontSize: '1.5em',
                        fontFamily: 'Source Sans Pro',
                    },
                },
                tickInterval:Math.floor((Math.floor(topscore/3))/100)*100,
                min:0,
                gridLineWidth: 1, 
                //max:topscore == 0 ? 100 : topscore , //TODO: make it global high score forevsies?
                max:topscore
            },
            xAxis: {labels:{style: {display:'none',fontSize: '1.5em',fontFamily: 'Source Sans Pro',},},tickInterval:10,},
            //formatter:function(){return (this.value / 12) + 2004;}},tickInterval:12,tickWidth:0,gridLineWidth: 0},
            plotOptions: {
                series: {animation: {duration: 1800,},},
                line: {lineWidth:3,marker: {enabled: false},color: '#FF0000'},},
            series: [{data:localStorage['recentscores'].split(' ').map(function(e){return Number(e)})}]
        });
     })();

var congrats = ['Congratulations', 'Nice job', 'Nice', 'Well done', 'Congrats'];
document.getElementById('congrats').innerHTML = congrats[Math.floor(Math.random()*congrats.length)];
//add commas to the display
document.getElementById('endscore').innerHTML = localStorage['score'].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//.readable_num();

var num_answered = Number(localStorage['num_answered']);
var score = Number(localStorage['score']);
$('#t3')[0].setAttribute('data-text', 'I got '+score+' on Trendquiz! Check it out:');

if (num_answered && num_answered != 0) {
} else {
  document.getElementById('congrats').innerHTML = 'Nice try';
}

document.getElementById('deleterecords').onclick = function() {
  localStorage['score'] = 0;
  localStorage['num_answered'] = 0;
  localStorage['topscore'] = 0;
  localStorage['recentscores'] = '';
  console.log('deleting records D:');
}

/*
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
 (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
 m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
 })(window,document,'script','http://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-52539363-1', 'auto');
ga('send', 'pageview');

*/

