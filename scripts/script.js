// ---------------------------------------------------------------- //
// --------------------- "GLOBAL" Variables ----------------------- //
// ---------------------------------------------------------------- //

var topicscopy = topicsArray.slice(0); //clone topicsarray
var pointscale = 1000;
var points = pointscale; // how many points the user gets for getting it right
var paused = false;
var pausable = true;
var end_game = false; // if the game is over
var loading_chart = false;
var thistopic; // DataPoints object
var load_page_delay = 1500; //in ms
var init_timer_dur = 1800;
var strikes = 0;

//html objs

var pausebutton = $('#pausebutton')[0];
var timer = document.getElementById('timer');

// timer consts
var w = 815; //higher = more granular
var initw = w;
var rate_factor = 1;

// Colors.
var green = "#24AD62";
var red = "#E74B3D";
var grey = "#5B6C7C";
var white = "#EEF2F3";
var black = "#000000";
var TQblue = "#3698D9";
var TQdarkblue = "#1A4E95";
var TQbackground = "#3F85F2";

// init shit
$('#header2').click(function() {window.location.assign('/');});

// ---------------------------------------------------------------- //
// --------------------- INTERACTIVITY ---------------------------- //
// ---------------------------------------------------------------- //

$(document).ready(function() {
	$('#rightanswer').click(function() {
   		checkifanswer($(this).children('.answer').html(), "right");
	}); 

	$('#leftanswer').click(function() {
   		checkifanswer($(this).children('.answer').html(), "left");
	});    

	$('#pausebutton').click(function() {
		pausegame();
	});

    $('#myModal').click(pausegame);
    $('#pausetext').click(pausegame);

    $(document).keydown(function(e){
        if (e.keyCode == 37) { // left
           checkifanswer($("#leftanswer").html(), "left");
        }
    });
    $(document).keydown(function(e){
        if (e.keyCode == 39) { //right
           checkifanswer($("#leftanswer").html(), "right");
        }
    });
    $(document).keydown(function(e){
        if (e.keyCode == 32) { //space
            pausegame();
        }
    });
});

function unpause() {
    $('#pausetext').hide();
    $('#chartcontainer').find('.highcharts-series').show();
    $('#myModal').modal('hide');
    pausebutton.style.borderColor = black;
    if (paused) {
        paused = false; 
        myLoop();
    }
}

function pause() {
    $('#pausetext').show();
    $('#chartcontainer').find('.highcharts-series').hide();
    $('#myModal').modal('show');
    paused = true; 
}

function pausegame() {
    if (pausable) {
        if (paused) {
            unpause();
        }	
        else{
            pause();
        }
    }
}

// ---------------------------------------------------------------- //
// -------------------- DRAWING THE GAME -------------------------- //
// ---------------------------------------------------------------- //

if (!(localStorage['score'])) {
    localStorage.setItem('score', 0);
}

/* this is deprecated and shit
function getCategory(topic) {
    var categorylist = localStorage.getItem('categorylist').split(" ");
    if (!categorylist || categorylist == '') 
        window.location.assign('/');

    if (categorylist.indexOf("music") > -1) 
        if (music.indexOf(topic) > -1) return 'Music';
    if (categorylist.indexOf("internet_memes") > -1) 
        if (internet_memes.indexOf(topic) > -1) return 'Internet';
    if (categorylist.indexOf("tech") > -1) 
        if (tech.indexOf(topic) > -1) return 'Technology';
    if (categorylist.indexOf("misc_seasonal") > -1)
        if (misc_seasonal.indexOf(topic) > -1) return 'Other';
    if (categorylist.indexOf("politics") > -1) 
        if (politics.indexOf(topic) > -1) return 'Politics';
    if (categorylist.indexOf("visualmedia") > -1) 
        if (visualmedia.indexOf(topic) > -1) return 'Movies/TV';
    if (categorylist.indexOf("sports") > -1) 
        if (sports.indexOf(topic) > -1) return 'Sports';
} */

var right = "eh"; //these are global now because drawcharts needs them.
var left = "oh well"; //i refuse to change their default values.

function setData() {
    if (topicsArray.length == 1) {
        window.location.assign('scorescreen.html?victory=1'); //they've exhausted the options. what do?
    }
    var index = getnewindex(topicsArray.length);
    thistopic = topicsArray[index];
    var LorR = rando(2);
    var condition = false;
    var wrongindex = getnewindex(topicscopy.length);
    while (topicscopy[wrongindex].getName() == thistopic.getName()) 
        wrongindex = getnewindex(topicscopy.length);
    var notthistopic = topicscopy[wrongindex];
    if (LorR < 1){ // then left is correct answer
        left = thistopic.getName();
        right = notthistopic.getName();
    }
    else { // right is correct answer
        right = thistopic.getName();
        left = notthistopic.getName();
    } 
    topicsArray.splice(index, 1); 
    $('#rightanswertext').html(right);
    $('#leftanswertext').html(left);
    $('#scorenums').html(Number(localStorage['score']));
}

setData();

function drawChart() {
    function x_formatter() {
        var year = (this.value / 12) + 4;
        return year < 10 ? "'0" + year.toString() : "'" + year.toString();
    }
    loading_chart = true;
    writeText();
    var loading_duration = init_timer_dur / rate_factor; //draws faster as the game goes faster 

    $('#chartcontainer').highcharts({
        tooltip: {
            crosshairs: [{
                width: 4,
                color: '#1A4E95'
            }],
            trackByArea: false,
            animation: false,
            backgroundColor: 'white',
            borderColor: '#1A4E95',
            hideDelay: 0,
            shared: true,
            style: {
              color: 'black',
              fontSize: '1.5em',
              padding: '8px',
              fontFamily: 'Roboto Condensed'
            },
            pointFormat: '<span style = "text-align:center;">{point.y:.0f}%</span>'
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
        title: {
            text: 'Popularity over time'
        },
        yAxis: {
            labels:{
                style: {
                    fontSize: '1.5em',
                    fontFamily: 'Roboto Condensed',
                },
            },
            title: {
                text:''
            },
            tickInterval:50,
            min:0,
            gridLineWidth: 1, 
            max:100,
        },
        xAxis: {
            labels:{
                style: {
                    fontSize: '1.5em',
                    fontFamily: 'Roboto Condensed',
                },
                formatter: x_formatter
            },
            tickInterval: 12,
            tickWidth: 0,
            gridLineWidth: 0
        },
        plotOptions: {
            series: {
                animation: {
                    duration: loading_duration,
                    complete: function() {
                        $('.blink').css('display','none');
                        loading_chart=false;
                        myLoop();
                    },
                }
            },
            line: {
                lineWidth:5,
                marker: {
                    enabled: false
                },
                color: '#24AD62'
            }
        },
        series: [{
            data:thistopic.getData()
        }]
    });
}

function writeText() {
    try { 
        $('.blink')[0].className = 'beam';
        $('.blink')[1].className = 'beam';
    } catch(e) {}
    var loading_duration = init_timer_dur / rate_factor; //draws faster as the game goes faster 

    var left_dur = loading_duration / left.length;
    var right_dur = loading_duration / right.length;
    var lower_dur = Math.min(left_dur, right_dur);
    lower_dur = Math.min(300, lower_dur);

    leftstr = '';
    rightstr = '';

    var i = 0;
    rightans = $('#rightanswertext');
    leftans = $('#leftanswertext');

    rightans.html(rightstr);
    leftans.html(leftstr);

    var i = 0, num_letters = Math.max(left.length, right.length);
    function draw_words() {
        if (i < left.length) {
            leftstr += left[i];
            leftans.html(leftstr);
        }
        if (i < right.length) {
            rightstr += right[i];
            rightans.html(rightstr);
        }
        i++;
        if( i < num_letters) {
            setTimeout(draw_words, lower_dur);
        }
    }
    draw_words();
}

drawChart();

function move_on(condition){
    loading_chart = true;
    if(condition && !end_game){
        timer_done = false;
        timer.style.width = '100%';
        timer.style.backgroundColor = green; 
        points = pointscale;
        setData();
        w = initw;
        if (rate_factor < 9)
            rate_factor *= 1.06;
        paused = false;
        pausable = true;
        drawChart();
    }
    else {
        paused = true;
        pausable = false;
        setTimeout(function(){move_on(true)}, load_page_delay); 
    }
}

function getnewindex(num){
	return rando(num);
}

function rando(numelements){
	return Math.floor(numelements*Math.random(0,1));
}

// ---------------------------------------------------------------- //
// -------------------- CHECKING THE ANSWER ----------------------- //
// ---------------------------------------------------------------- //

function checkifanswer(name, side){
    if (paused || loading_chart) return;
    var answertocheck = thistopic.getName();
    answertocheck = answertocheck.toLowerCase();
    unpause();
	if (name.toLowerCase() == answertocheck){ //they got it right
        pausable = false;
		got_it_right(side);
	} else { 
        pausable = false;
		got_it_wrong(side);
	}
	move_on(false);
}

function add_strike() { 
    strikes += 1;
    var currentstrike = $('#strikes').children('p:not(.strike)').first();
    currentstrike.html('x');
    currentstrike.removeClass('good');
    currentstrike.addClass('strike');

    if (strikes == 3) {
        end_game = true;
        setTimeout(function(){
        window.location.href = "scorescreen.html";
    }, (load_page_delay * 0.9));
    var topScore = localStorage['topscore'];
    var recentScores = localStorage['recentscores']; //SPACE SEPARATED
        if (recentScores) { //this isn't their first playthrough
            if (recentScores.split(' ').length >= 10) { //then get rid of the oldest one (AKA THE ONE AT THE FRONT IT'S A STACK) and append
                localStorage['recentscores'] = recentScores.split(' ').slice(1).join(' ');
            }
            localStorage['recentscores'] += ' ' + localStorage['score'];
            if (Number(localStorage['topscore']) < Number(localStorage['score'])) {
                localStorage['topscore'] = localStorage['score'];
            }
        } else { //this is their first time playing - set recent and top to this run.
            localStorage['topscore'] = localStorage['recentscores'] = localStorage['score'];
        }
   }
}

function fade(element, type) {
    var op = 1;  // initial opacity
    var fadetimer = setInterval(function () {
        element.style.opacity = op * 0.9;
        element.style.filter = 'alpha(opacity=' + op * 90 + ')';
        if (op <= 0.1){
            clearInterval(fadetimer);
            element.style.display = 'none';
        }
        op -= op * 0.1;
    }, 50);
}

function show_popup(type) {
    var popuptext = $('#popuptext')[0];
    popuptext.style.opacity = 1;
    popuptext.style.filter = 'alpha(opacity=100)';
    popuptext.style.display = 'block';
    switch(type) {
        case 'points':
            popuptext.style.fontSize = '1500%';
            popuptext.innerHTML = '+ <span class="TQnum" id="points">'+ Math.round(points)+ '</span>';
            popuptext.style.color = green;
            break;
        case 'strike':
            popuptext.style.fontSize = '1500%';
            popuptext.innerHTML = 'x';
            popuptext.style.color = red;
            break;
        default:
            console.log("You're calling this function incorrectly.");
    }
    setTimeout(function(){fade(popuptext, type);}, 300);
}

function got_it_right(side) {
	localStorage['score'] = Math.round(Number(localStorage['score']) + points);
    localStorage['num_answered'] = Number(localStorage['num_answered'])+1;
    show_popup('points');
}

function got_it_wrong(side){
    show_popup('strike');
    setTimeout(function(){
        add_strike();
    }, load_page_delay*0.9);
}

// ---------------------------------------------------------------- //
// -------------------- GAME TIMER CODE --------------------------- //
// ---------------------------------------------------------------- //

var r = 0, rs = '0';
var g = 255, gs = '255';

var timer_done = false;
var cleared = true;

var countdown = setInterval(runTimer, 50);
clearInterval(countdown);
setTimeout(function(){
    cleared = false;
    countdown = setInterval(runTimer, 50);
}, init_timer_dur)


var start_green = 36;

function runTimer() {
    if (paused) {
        clearInterval(countdown);
        cleared = true;
    }
    w -= rate_factor * 1.5;
    timer.style.width = ((w / initw) * 100) + '%';
    if (timer.style.width.split('%')[0] > 50) {
        r = (100-timer.style.width.split('%')[0]) * (255-start_green)/50; 
        r += start_green;
        rs = r.toString().split('.')[0]; 
        gs = (173+((255-173) * (r/255))).toString().split('.')[0]; //holy shit math
        timer.style.backgroundColor = "rgb("+rs+", "+gs+", 98)";
        points = pointscale - (Number(r) / 255)*(pointscale/2); //the way it works is, they start getting fewer and fewer points for getting the answer
    } else {
        g = (timer.style.width.split('%')[0]) * 255/50; 
        gs = g.toString().split('.')[0];
        timer.style.backgroundColor = "rgb(255, "+gs+", 98)"; 
        points = Number(g*(pointscale/2)) / 255;
    }
    points = Math.round(points/10) * 10;
    if (w > 0) myLoop();
    else {
        if (!timer_done) {
            timer_done = true;
            got_it_wrong("time");
            move_on(false);
        }
    }
}

function myLoop() {          
    if (paused) {
        clearInterval(countdown);
    }
    else if (cleared) {
        countdown = setInterval(runTimer, 50);
        cleared = false;
    }
}
