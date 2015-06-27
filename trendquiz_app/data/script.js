// ---------------------------------------------------------------- //
// --------------------- "GLOBAL" Variables ----------------------- //
// ---------------------------------------------------------------- //

var debug = false; //if you wanna code w/o having to pause it each time
var topicscopy = topicsArray.slice(0); //clone topicsarray
var pointscale = 1000;
var points = pointscale; //how many points the user gets for getting it right
var paused = false;
var pausable = true;
var fuckyoueric = !(!localStorage.getItem('fuckyoueric'));  //or or this gry #98A2A3
var refresh = false; //refresh page each topic answer? no
var end_game = false; //if the game is over
var loading_chart = false;
var thistopic; //DataPoints object
var load_page_delay = 1500; //in ms

//html objs
var rightanswer = $('#rightanswer')[0];
var leftanswer = $('#leftanswer')[0];
var pausebutton = $('#pausebutton')[0];
var currentstrike = $('#strikes')[0].firstChild.nextSibling;
var popuptext = $('#popuptext')[0];
var timer = document.getElementById('timer');

//timer consts
var w = 815; //higher = more granular
var initw = w;
var rate_factor = 1;

//Colors.
var green = "#24AD62";
var red = "#E74B3D";
var grey = "#5B6C7C";
var white = "#EEF2F3";
var black = "#000000";
var TQblue = "#3698D9";
var TQdarkblue = "#1A4E95";
var TQbackground = "#3F85F2";

//init shit
document.getElementById('header').addEventListener('click', function() {window.location.assign('/');});

// ---------------------------------------------------------------- //
// --------------------- TOPIC PICKING FUN! ----------------------- //
// ---------------------------------------------------------------- //

if (!debug)
    window.onbeforeunload = function() {
        pausegame();
        return 'your score will be gone if you leave the page   (sorry for the popup)';
    };

// ---------------------------------------------------------------- //
// --------------------- INTERACTIVITY ---------------------------- //
// ---------------------------------------------------------------- //

$(document).ready(function() {
	$('#rightanswer').click(function() {
	   		checkifanswer(this.innerHTML, "right");
	}); 

	$('#leftanswer').click(function() {
	   		checkifanswer(this.innerHTML, "left");
	});

	$('#pausebutton').click(function() {
        pausebutton.style.backgroundColor = TQdarkblue
        pausebutton.style.borderColor = TQdarkblue;
		pausegame();
	});

    $(document).keydown(function(e){
        if (e.keyCode == 37) { //left arrow
           checkifanswer(leftanswer.innerHTML, "left");
        }
    });
    $(document).keydown(function(e){
        if (e.keyCode == 39) { //right arrow
           checkifanswer(rightanswer.innerHTML, "right");
        }
    });
    $(document).keydown(function(e){
        if (e.keyCode == 32) { //space
            pausegame();
        }
    });
});

function unpause(){
    $('#pausetext').hide();
    $('#chartcontainer').find('.highcharts-series').show();
    $('#myModal').modal('hide');
    pausebutton.style.backgroundColor = TQbackground
    //pausebutton.innerHTML = "Pause";
    pausebutton.style.borderColor = black;
    if (!debug && paused) {
        paused = false; 
        myLoop();
    }
}
function pause(){
    $('#pausetext').show();
    pausebutton.style.backgroundColor = TQdarkblue;
    pausebutton.style.borderColor = TQdarkblue;
    $('#chartcontainer').find('.highcharts-series').hide();
    $('#myModal').modal('show');
    paused = true; 
}

function pausegame(){
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

function setData() {
    if (topicsArray.length == 1) {
        window.onbeforeunload = function (){};
        window.location.assign('scorescreen.html?victory=1'); //they've exhausted the options. what do?
    }
    var index = getnewindex(topicsArray.length);
    thistopic = topicsArray[index];
    var LorR = rando(2);
    var lastone= 0;
    var condition = false;
    var right = "eh";
    var left = "oh well";
    var wrongindex = getnewindex(topicscopy.length);
    while (topicscopy[wrongindex].getName() == topicsArray[index].getName()) 
        wrongindex = getnewindex(topicscopy.length);
    var notthistopic = topicscopy[wrongindex];
    if(LorR < 1){ //then left is correct answer
        left = thistopic.getName();
        right = notthistopic.getName();
    }
    else { //right is correct answer
        right = thistopic.getName();
        left = notthistopic.getName();
    } 
    topicsArray.splice(index, 1); 
    if (fuckyoueric) {
        rightanswer.innerHTML = right.toLowerCase();
        leftanswer.innerHTML = left.toLowerCase();
    } else {
        rightanswer.innerHTML = right;
        leftanswer.innerHTML = left;
    }
    $('#scorenums')[0].innerHTML = Number(localStorage['score']);
}

setData();

function drawChart() {
    loading_chart = true;
    $(function () { 
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
                hideDelay:0,
                shared:true,
                style: {
                  color: 'black',
                  fontSize: '1.5em',
                  padding: '8px',
                  fontFamily: 'Arial'
                },
                pointFormat: '<span style = "text-align:center;">{point.y:.0f}%</span>'
            },
            chart: {
                type: 'line',
                animation: true,
                style: {
                fontFamily: 'Raleway',
                backgroundColor: 'white'
            },
            reflow: true
            },
            legend: {
                enabled: false
            },
            title: {
                text: 'Search Popularity vs. Time'
            },
            yAxis: {
                labels:{
                    style: {
                        fontSize: '1.5em',
                        fontFamily: 'Arial',
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
                        fontFamily: 'Arial',
                    },
                    formatter:function(){return (this.value / 12) + 2004;}
                },
                tickInterval:12,
                gridLineWidth: 1 
            },
            plotOptions: {
                series: {
                    animation: {
                        duration: 1800 / rate_factor, //draws faster as the game goes faster
                        complete: function() {loading_chart=false;myLoop();},
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
    });
}
drawChart();

//load new questions
function move_on(condition){
    loading_chart = true;
    if(condition && !end_game){
        if (refresh) {
            location.reload();
        } else {
            timer_done = false;
            document.getElementById('timer').style.width = '100%';
            document.getElementById('timer').style.backgroundColor = green;
            points = pointscale;
            setData();
            w = initw;
            if (rate_factor < 9)
                rate_factor *= 1.06;
            paused = debug;
            /* //no longer necessary because myLoop happens at the end of the animation 
            if (!debug)
                setTimeout(function(){
                    myLoop();
                }, 1800 / rate_factor);
                */
            reset_colors();
            paused = false;
            pausable = true;
            drawChart();
        }
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
    name = name.toLowerCase();
    unpause();
	if (name===answertocheck){ //they got it right
        pausable = false;
		got_it_right(side);
	}
	else{ //thry got it wrong
        pausable = false;
		got_it_wrong(side);
	}
	move_on(false);
}

function lefthover() {
    leftanswer.style.backgroundColor = TQdarkblue;
    leftanswer.style.borderColor = TQdarkblue;
}
function leftout() {
    leftanswer.style.backgroundColor = TQbackground;
    leftanswer.style.borderColor = black;
}

function righthover() {
    rightanswer.style.backgroundColor = TQdarkblue;
    rightanswer.style.borderColor = TQdarkblue;
}
function rightout() {
    rightanswer.style.backgroundColor = TQbackground;
    rightanswer.style.borderColor = black;
}

function pausehover() {
    pausebutton.style.backgroundColor = TQdarkblue;
    pausebutton.style.borderColor = TQdarkblue;
}
function pauseout() {
    pausebutton.style.backgroundColor = TQbackground;
    pausebutton.style.borderColor = black;
}

function reset_colors() {
	$('#chartcontainer')[0].style.borderColor = black;
	leftanswer.style.borderColor = black;
	rightanswer.style.borderColor = black;

    leftanswer.style.backgroundColor = TQbackground;
    rightanswer.style.backgroundColor = TQbackground;
    leftanswer.addEventListener('mouseover', lefthover);
    leftanswer.addEventListener('mouseout', leftout);
    rightanswer.addEventListener('mouseover', righthover);
    rightanswer.addEventListener('mouseout', rightout);
    pausebutton.addEventListener('mouseover', pausehover);
    pausebutton.addEventListener('mouseout', pauseout);
}

function add_strike() { //for if they get a question wrong
  // overview: there is a div of strikes.
  // there are <strikes> strikes. this function strikes the next strike
  // if we strike the <strikes>th strike, then we go to scorescreen.
   currentstrike.innerHTML = 'x';
   currentstrike.className = 'strike'
   currentstrike = currentstrike.nextSibling.nextSibling;
   if (!currentstrike) {
    window.onbeforeunload = function (){};
    end_game = true;
    setTimeout(function(){
                   window.location.assign("scorescreen.html");
               },
               (load_page_delay * 0.9));
  }
}
function fade(element, type) {
    var op = 1;  // initial opacity
    var fadetimer = setInterval(function () {
        var invop = 1-op;
        if (type == 'points') {
            element.style.right = (invop * 40) + '%';
            element.style.bottom = (invop*(75-40) + 40) + '%';
        } else {
            element.style.bottom = (45*op+10) + '%';
            element.style.fontSize = ((2200-600)*op + 600) + '%'; 
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ')';
        if (op <= 0.1){
            clearInterval(fadetimer);
            element.style.right = '0%';
            element.style.fontSize = '600%';
            element.style.bottom = '40%';
            element.style.display = 'none';
        }
        op -= op * 0.1;
    }, 50);
}
function show_popup(type) {
    popuptext.style.opacity = 1;
    popuptext.style.filter = 'alpha(opacity=100)';
    popuptext.style.display = 'block';
    switch(type) {
        case 'points':
            popuptext.style.fontSize = '800%';
            popuptext.innerHTML = '+<span class="TQnum" id="points">'+Math.round(points)+'</span>';
            popuptext.style.color = green;
            break;
        case 'strike':
            popuptext.style.bottom = '55%';
            popuptext.style.fontSize = '1800%';
            popuptext.innerHTML = 'x';
            popuptext.style.color = red;
            break;
        default:
            console.log('You\'re calling this function incorrectly.');
    }
    setTimeout(function(){fade(popuptext, type);}, 500);
}

function got_it_right(side) {
    leftanswer.removeEventListener('mouseover', lefthover);
    leftanswer.removeEventListener('mouseout', leftout);
    rightanswer.removeEventListener('mouseover', righthover);
    rightanswer.removeEventListener('mouseout', rightout);
    pausebutton.removeEventListener('mouseover', pausehover);
    pausebutton.removeEventListener('mouseout', pauseout);
    $('#chartcontainer')[0].style.borderColor = green;
	if(side==="right"){
		leftanswer.style.backgroundColor = red;
		leftanswer.style.borderColor = red;
		rightanswer.style.backgroundColor = green;
		rightanswer.style.borderColor = green;
	}

	if(side==="left"){
		rightanswer.style.backgroundColor = red;
		rightanswer.style.borderColor = red;
		leftanswer.style.backgroundColor = green;
		leftanswer.style.borderColor = green;
	}
	localStorage['score'] = Math.round(Number(localStorage['score']) + points);
    localStorage['num_answered'] = Number(localStorage['num_answered'])+1;
    show_popup('points');
}

function got_it_wrong(side){
    leftanswer.removeEventListener('mouseover', lefthover);
    leftanswer.removeEventListener('mouseout', leftout);
    rightanswer.removeEventListener('mouseover', righthover);
    rightanswer.removeEventListener('mouseout', rightout);
	$('#chartcontainer')[0].style.borderColor =  red;
	if(side==="left") {
		rightanswer.style.backgroundColor = green;
		rightanswer.style.borderColor = green;
		leftanswer.style.backgroundColor = red;
		leftanswer.style.borderColor = red;
	}
	if(side==="right") {
		rightanswer.style.backgroundColor = red;
		rightanswer.style.borderColor = red;
		leftanswer.style.backgroundColor = green;
		leftanswer.style.borderColor = green;
	}
	if(side==="time") {
        leftanswer.style.backgroundColor = red;
        leftanswer.style.borderColor = red;
        rightanswer.style.backgroundColor = red;
        rightanswer.style.borderColor = red;
	}
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
var cleared = false;

var countdown = setInterval(runTimer, 50);

function runTimer() {
    if (paused) {
        clearInterval(countdown);
        cleared = true;
    }
    w -= rate_factor * 1.5;
    timer.style.width = ((w / initw) * 100) + '%';
    if (timer.style.width.split('%')[0] > 50) {
        r = (100-timer.style.width.split('%')[0]) * 255/50; 
        rs = r.toString().split('.')[0]; 
        timer.style.backgroundColor = "rgb("+rs+", 255, 98)";
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

function myLoop () {          
    if (paused) {
        clearInterval(countdown);
    }
    else if (cleared) {
        countdown = setInterval(runTimer, 50);
        cleared = false;
    }
}

paused = debug;
/*
   if (!debug) 
   document.addEventListener('DOMContentLoaded', function(){
   setTimeout(function(){
   myLoop();
   }, 1800 / rate_factor);
   });
   */
