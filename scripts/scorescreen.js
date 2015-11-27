var i = 0;

Number.prototype.readable_num = function() {
  return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

var topscore = Number(localStorage['topscore']);

$(document).ready(function () {
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
              fontFamily: 'Roboto Condensed'
            },
        },
        chart: {
            type: 'line',
            animation: true,
            style: {
                fontFamily: 'Roboto Condensed',
                backgroundColor: 'white'
            },
        reflow: true
        },
        legend: {
            enabled: false
        },
        tooltip: {
            formatter: function() {return '<p class="TQnum" style="font-size:2em;">'+this.y+'</p>';},
        },
        title: {
            text: 'Your Scores',
        },
        yAxis: {
            title:'',
            labels:{
                style: {
                    fontSize: '1.5em',
                    fontFamily: 'Roboto Condensed',
                },
            },
            tickInterval:Math.floor((Math.floor(topscore/3))/100)*100,
            min:0,
            gridLineWidth: 1, 
            max:topscore
        },
        xAxis: {labels:{style: {display:'none',fontSize: '1.5em',fontFamily: 'Roboto Condensed',},},tickInterval:10,},
        plotOptions: {
            series: {animation: {duration: 1800,},},
            line: {lineWidth:3,marker: {enabled: false},color: '#FF0000'},},
        series: [{data:localStorage['recentscores'].split(' ').map(function(e){return Number(e)})}]
    });
 });

var congrats = ['Congratulations', 'Nice job', 'Nice', 'Well done', 'Congrats'];
$('#congrats').html(congrats[Math.floor(Math.random()*congrats.length)]);
$('#endscore').html(localStorage['score'].replace(/\B(?=(\d{3})+(?!\d))/g, ','));

var num_answered = Number(localStorage['num_answered']);
var score = Number(localStorage['score']);
$('#t3')[0].setAttribute('data-text', 'I got ' + score + ' on Trendquiz! Check it out:');

if (num_answered && num_answered != 0) {
} else {
  $('#congrats').html('Nice try');
}

$('#deleterecords').click(function() {
  localStorage['score'] = 0;
  localStorage['num_answered'] = 0;
  localStorage['topscore'] = 0;
  localStorage['recentscores'] = '';
});
