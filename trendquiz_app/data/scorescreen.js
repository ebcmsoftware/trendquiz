( function() {
  if (window.CHITIKA === undefined) { window.CHITIKA = { 'units' : [] }; };
  var unit = {"calltype":"async[2]","publisher":"ebcmsoftware","width":550,"height":150,"sid":"Chitika Default","color_bg":"3F85F2","color_button":"3F85F2"};
  var placement_id = window.CHITIKA.units.length;
  window.CHITIKA.units.push(unit);
  document.write('<div id="chitikaAdBlock-' + placement_id + '"></div>');
  }());

Number.prototype.readable_num = function() {
  return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

if (window.location.search == '?victory=1') {
  document.getElementById('endtext').insertBefore(document.createElement('br'),document.getElementById('endtext').firstChild);
  document.getElementById('endtext').insertBefore(document.createTextNode('Wow, you completed all the options in the categories you selected! Good job!'),
      document.getElementById('endtext').firstChild);
}
var congrats = ['Congratulations', 'Nice job', 'Nice', 'Well done', 'Congrats'];
document.getElementById('congrats').innerHTML = congrats[Math.floor(Math.random()*congrats.length)];
//add commas to the display
document.getElementById('endscore').innerHTML = Number(localStorage['score']).readable_num();

var score = Number(localStorage['score']);
var num_answered = Number(localStorage['num_answered']);
if (num_answered && num_answered != 0) {
  document.getElementById("num_answered").innerHTML = num_answered;
  var ppq = Math.round(score / num_answered); 
  document.getElementById("ppq").innerHTML = Math.round(score / num_answered);
  if (localStorage['score_best'] == undefined || score > Number(localStorage['score_best'])) {
    localStorage['score_best'] = score;
    document.getElementById('score_record').style.display = 'inline'; //at the top
    document.getElementById('score_best').className += ' newrecord';
  }
  if (localStorage['num_answered_best'] == undefined || num_answered > Number(localStorage['num_answered_best'])) {
    localStorage['num_answered_best'] = num_answered;
    document.getElementById('num_answered_best').className += ' newrecord';
  }
  if (localStorage['ppq_best'] == undefined || ppq > Number(localStorage['ppq_best'])) {
    localStorage['ppq_best'] = ppq;
    document.getElementById('ppq_best').className += ' newrecord';
  }
} else {
  document.getElementById('congrats').innerHTML = 'Nice try';
}

document.getElementById('deleterecords').onclick = function() {
  localStorage['score']=0;
  localStorage['num_answered']=0;
  localStorage['ppq_best']=0;
  localStorage['score_best']=0;
  localStorage['num_answered_best']=0;
  document.getElementById('score_best').innerHTML = '0';
  document.getElementById('num_answered_best').innerHTML = '0';
  document.getElementById('ppq_best').innerHTML = '0';
}

document.getElementById('this_run_score').innerHTML = score.readable_num();
document.getElementById('score_best').innerHTML = (Number(localStorage['score_best']) || 0).readable_num();
document.getElementById('num_answered_best').innerHTML = (Number(localStorage['num_answered_best']) || 0).readable_num();
document.getElementById('ppq_best').innerHTML = (Number(localStorage['ppq_best']) || 0).readable_num();

var set_score = false; 
var set_num_answered = false; 
var post_params = new Object();

function post_name() {
  if (set_score)
    post_params['sname'] = document.getElementById('user_name').value;
  if (set_num_answered)
    post_params['nname'] = document.getElementById('user_name').value;
  console.log(post_params);
  $.post('http://trendquiz.com/setrecord', post_params, function() {window.location.reload();});
}

/*
window.onload = function() {
  if ($('.begging').height() <= 60) {
    $('#begging')[0].innerHTML = "If you enjoyed the game, please consider turning off your adblock! Ads and donations are the only 2 things that keep the servers running. We only show ads out-of-game, we promise.";
  }
  else {
    console.log($('.begging').height());
  }
}
*/

var req = new XMLHttpRequest;
req.open('GET', 'http://trendquiz.com/getrecordjson')
req.send();
req.onreadystatechange = function() {
  if (req.readyState == 4) {
    var global_records = JSON.parse(req.responseText);
    document.getElementById('score_global').innerHTML = global_records['score'][1].readable_num();
    document.getElementById('num_answered_global').innerHTML = global_records['num_answered'][1].readable_num();
    document.getElementById('score_global_record').innerHTML = global_records['score'][0];
    document.getElementById('num_answered_global_record').innerHTML = global_records['num_answered'][0];
    var flag = false;
    if (score > global_records['score'][1]) {
      flag = flag || score != global_records['score'];
      post_params['score'] = score;
      document.getElementById('score_global').innerHTML = score.readable_num();
      document.getElementById('score_global').className += ' newrecord';
      set_score = true;
    }
    else if (Number(localStorage['score_best']) == Number(global_records['score'][1])) {
      document.getElementById('score_global').className += ' newrecord';
    }

    if (num_answered > global_records['num_answered'][1]) {
      flag = flag || num_answered != global_records['num_answered'];
      post_params['num_answered'] = num_answered;
      document.getElementById('num_answered_global').innerHTML = num_answered.readable_num();
      document.getElementById('num_answered_global').className += ' newrecord';
      set_num_answered = true;
    }
    else if (Number(localStorage['num_answered_best']) == global_records['num_answered'][1]) {
      document.getElementById('num_answered_global').className += ' newrecord';
    }
    if (set_score || set_num_answered) {
      document.getElementById('nameform').style.display = "inline";
    }

    if (post_params && !($.isEmptyObject(post_params)) && flag) {
      console.log("sending the post.");
      $.post('http://trendquiz.com/setrecord', post_params);
    }
  }
}

document.getElementById('sendname').addEventListener('click', post_name);

