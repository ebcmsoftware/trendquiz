// ---------------------------------------------------------------- //
// --------------------- "GLOBAL" Variables ----------------------- //
// ---------------------------------------------------------------- //

var debug = true; //if you wanna code w/o having to pause it each time
var debug = false; //if you wanna code w/o having to pause it each time
var topicscopy = topicsArray.slice(0); //clone topicsarray
var pointscale = 1000;
var points = pointscale; //how many points the user gets for getting it right
var paused = false;
var pausable = true;
var fuckyoueric = !(!localStorage.getItem('fuckyoueric'));  //or or this gry #98A2A3
fuckyoueric = true;
var mobile = ($('#header2')[0].style.display != undefined && $('#header2')[0].style.display == '') || false;
var refresh = false; //refresh page each topic answer? no
var end_game = false; //if the game is over
var loading_chart = false;
var thistopic; //DataPoints object
var load_page_delay = 1500; //in ms
var init_timer_dur = 1800;

//html objs
var rightanswer = $('#rightanswertext')[0];
var leftanswer = $('#leftanswertext')[0];
var pausebutton = $('#pausebutton')[0];
var currentstrike = $('#strikes')[0].firstChild.nextSibling.nextSibling.nextSibling;
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
$('#header2').click(function() {window.location.assign('/');});

// ---------------------------------------------------------------- //
// --------------------- TOPIC PICKING FUN! ----------------------- //
// ---------------------------------------------------------------- //

if (!debug)
    window.onbeforeunload = function() {
        pausegame();
        return 'Your score will be gone if you leave the page! (Sorry for the popup)';
    };

// ---------------------------------------------------------------- //
// --------------------- INTERACTIVITY ---------------------------- //
// ---------------------------------------------------------------- //

$(document).ready(function() {
	$('#rightanswer').click(function() {
	   		checkifanswer(this.innerText, "right");
	}); 

	$('#leftanswer').click(function() {
	   		checkifanswer(this.innerText, "left");
	});

	$('#pausebutton').click(function() {
        /*
        pausebutton.style.backgroundColor = TQdarkblue
        pausebutton.style.borderColor = TQdarkblue;
        */
		pausegame();
	});

    $(document).keydown(function(e){
        if (e.keyCode == 37) { //left arrow
           checkifanswer(leftanswer.innerText, "left");
        }
    });
    $(document).keydown(function(e){
        if (e.keyCode == 39) { //right arrow
           checkifanswer(rightanswer.innerText, "right");
        }
    });
    $(document).keydown(function(e){
        if (e.keyCode == 32) { //space
            pausegame();
        }
    });
});

$('#myModal')[0].addEventListener('click', pausegame);
$('#pausetext')[0].addEventListener('click', pausegame);

function unpause(){
    $('#pausetext').hide();
    $('#chartcontainer').find('.highcharts-series').show();
    $('#myModal').modal('hide');
    /*
    pausebutton.style.backgroundColor = TQbackground
    */
    //pausebutton.innerHTML = "Pause";
    pausebutton.style.borderColor = black;
    if (!debug && paused) {
        paused = false; 
        myLoop();
    }
}
function pause(){
    $('#pausetext').show();
    /*
    pausebutton.style.backgroundColor = TQdarkblue;
    pausebutton.style.borderColor = TQdarkblue;
    */
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

function getCategory(topic) {
    var categorylist = localStorage.getItem('categorylist').split(" ");
    //i'm doing this in case they somehow get linked to /index without first visiting /trendquiz.html
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
}

var right = "eh"; //these are global now because drawcharts needs them.
var left = "oh well"; //i refuse to change their default values.
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
    var wrongindex = getnewindex(topicscopy.length);
    while (topicscopy[wrongindex].getName() == topicsArray[index].getName()) 
        wrongindex = getnewindex(topicscopy.length);
    var notthistopic = topicscopy[wrongindex];
    var thiscategory = getCategory(thistopic);
    var notthiscategory = getCategory(notthistopic);
    if (LorR < 1){ //then left is correct answer
        left = thistopic.getName()// + '<br><span class="categorylabel">(' + thiscategory + ')</span>';
        right = notthistopic.getName()// + '<br><span class="categorylabel">(' + notthiscategory + ')</span>';
    }
    else { //right is correct answer
        right = thistopic.getName()// + '<br><span class="categorylabel">(' + thiscategory + ')</span>';
        left = notthistopic.getName()// + '<br><span class="categorylabel">(' + notthiscategory + ')</span>';
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
    function x_formatter() {
        var year = (this.value / 12) + 4;
        return year < 10 ? "'0" + year.toString() : "'" + year.toString()  ;
    }
    
    loading_chart = true;
    var loading_duration = init_timer_dur / rate_factor; //draws faster as the game goes faster 
    (function () { 
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
                  fontFamily: 'Source Sans Pro'
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
                text: 'popularity over time'
            },
            yAxis: {
                labels:{
                    style: {
                        fontSize: '1.5em',
                        fontFamily: 'Source Sans Pro',
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
                        fontFamily: 'Source Sans Pro',
                    },
                    formatter:x_formatter
                },
                tickInterval:12,
                tickWidth:0,
                gridLineWidth: 0 
            },
            plotOptions: {
                series: {
                    animation: {
                        duration: loading_duration,
                        complete: function() {
                            try {
                                $('.beam')[0].className = 'blink';
                                $('.beam')[1].className = 'blink';
                            } catch(e) {} //this happens sometimes but doesnt hurt anyhting just doing this to avoid the console log errors or w/e
                            try {
                            } catch(e) {}
                            //$('.blink').css('display','none');
                            //console.log(':-)');
                        }
                    }
                },
                line: {
                    lineWidth:0,
                    marker: {
                        enabled: false
                    },
                    color: '#FF0000'
                }
            },
            series: [{
                data:thistopic.getData()
            }]
        });
     })();
    writeText();
    setTimeout(
     //$(function () { 
     function () { 
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
                  fontFamily: 'Source Sans Pro'
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
                text: 'popularity over time'
            },
            yAxis: {
                labels:{
                    style: {
                        fontSize: '1.5em',
                        fontFamily: 'Source Sans Pro',
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
                        fontFamily: 'Source Sans Pro',
                    },
                    formatter:x_formatter
                },
                tickInterval:12,
                tickWidth:0,
                gridLineWidth: 0
            },
            plotOptions: {
                series: {
                    animation: {
                        duration: loading_duration,
                        complete: function() {
                            //$('.blink').css('display','none');
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
     },
    //});
    loading_duration);
}

// into the boxes
function writeText() {
    //$('.blink').css('display','block-inline');
    // while it's typing, have a solid beam
    try { 
        $('.blink')[0].className = 'beam';
        $('.blink')[1].className = 'beam';
    } catch(e) {}
    var loading_duration = init_timer_dur / rate_factor; //draws faster as the game goes faster 
    //for each char, wait *_dur to add it to the div
    var left_dur = loading_duration / left.length;
    var right_dur = loading_duration / right.length;
    var lower_dur = Math.min(left_dur, right_dur);
    lower_dur = Math.min(300, lower_dur); //#code
    //leftanswer.innerHTML = '&nbsp;';
    //rightanswer.innerHTML = '&nbsp;';
    leftanswer.innerHTML = '';
    rightanswer.innerHTML = '';
    var i = 0;
    var leftafter = $('#leftafter')[0];
    var rightafter = $('#rightafter')[0];
    for (i = 0; i < left.length; i++) {
        leftafter.innerHTML += '&nbsp;';
    }
    for (i = 0; i < right.length; i++) {
        rightafter.innerHTML += '&nbsp;';
    }
    i = 0;
    if (!fuckyoueric) {
        setInterval(function() {
            if (i < left.length) {
                //leftanswer.innerHTML += left[i];
                leftanswer.innerHTML[i] = left[i];
            }
            if (i < right.length) {
                //rightanswer.innerHTML += right[i];
                rightanswer.innerHTML[i] = right[i];
            }
            i++;
        }, lower_dur);
    } else {
        setInterval(function() {
            if (i < left.length) {
                //leftanswer.innerHTML += left.toLowerCase()[i];
                leftanswer.innerHTML += (left.toLowerCase())[i];
                leftafter.innerHTML = leftafter.innerHTML.replace('&nbsp;', '');
            }
            if (i < right.length) {
                //rightanswer.innerHTML += (right.toLowerCase())[i];
                rightanswer.innerHTML += right.toLowerCase()[i];
                rightafter.innerHTML = rightafter.innerHTML.replace('&nbsp;', '');
            }
            i++;
        }, lower_dur);
    }
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
            timer.style.width = '100%';
            timer.style.backgroundColor = green; 
            /*
            document.getElementById('timer').style.backgroundColor = green;
            */
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
    //console.log(answertocheck);
    //console.log(name);
    //name = name.split('&nbsp;')[1].split('<')[0].toLowerCase(); //for if it starts with a nbsp
    unpause();
	if (name == answertocheck){ //they got it right
        pausable = false;
		got_it_right(side);
	}
	else{ //thry got it wrong
        //console.log(answertocheck);
        //console.log(name);
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
    /*
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
    */
}

function add_strike() { //for if they get a question wrong
  // overview: there is a div of strikes.
  // there are <strikes> strikes. this function strikes the next strike
  // if we strike the <strikes>th strike, then we go to scorescreen.
   currentstrike.innerHTML = 'x';
   currentstrike.className = 'strike'
   currentstrike = currentstrike.nextSibling.nextSibling;
   if (!currentstrike) {
      window.onbeforeunload = function (){}; //remove "leaving this page" alt
      end_game = true;
      setTimeout(function(){
                   window.location.href = "scorescreen.html";
               },
               (load_page_delay * 0.9));
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
        /*
        var invop = 1-op;
        if (type == 'points') {
            element.style.right = (invop * 40) + '%';
            element.style.bottom = (invop*(75-40) + 40) + '%';
        } else {
            element.style.bottom = (45*op+10) + '%';
            element.style.fontSize = ((2200-600)*op + 600) + '%'; 
        }
        */
        element.style.opacity = op * 0.9;
        element.style.filter = 'alpha(opacity=' + op * 90 + ')';
        if (op <= 0.1){
            clearInterval(fadetimer);
            element.style.display = 'none';
            /*
            element.style.right = '0%';
            element.style.fontSize = '600%';
            element.style.bottom = '40%';
             */
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
            popuptext.style.fontSize = '1500%';
            popuptext.innerHTML = '+<span class="TQnum" id="points">'+Math.round(points)+'</span>';
            popuptext.style.color = green;
            break;
        case 'strike':
            //popuptext.style.bottom = '55%';
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
    /*
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
    */
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
    /*
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
    */
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
},init_timer_dur)

//green: 24AD62
//rgb(36,173,98)
var start_green = 36;//0

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

paused = debug;

