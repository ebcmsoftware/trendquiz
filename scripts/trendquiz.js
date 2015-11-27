var toggle = false;

function selectAll() {
  var button = document.getElementById('categorysettings').firstChild.nextSibling;
  while (button) {
    if (!toggle) {
      button.className = 'btn btn-primary active';
      button.firstChild.checked = true;
    } else {
      button.className = 'btn btn-primary';
      button.firstChild.checked = false;
    }
    button = button.nextSibling.nextSibling;
  }
  toggle = !toggle;
  setTimeout(function() {document.getElementById('select_all').className = 'btn btn-primary';}, 100);
}

var categorylist = localStorage['categorylist'];
if (categorylist) {
    var split_arr = categorylist.split(' ');
    split_arr.forEach(function(category) {
        var input = document.getElementById(category)
        input.checked = true;
        input.parentNode.className = 'btn btn-primary active';
    });
}
var america = localStorage['america'];
if (america != undefined && (america == 'false' || america == false)) {
    document.getElementById('international-switch').checked = false;
}

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
 (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
 m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
 })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-52539363-1', 'auto');
ga('send', 'pageview');

localStorage['score'] = 0;
localStorage['num_answered'] = 0;
localStorage['america'] = $('#international-switch').attr("checked");

$('#international-switch').click(function(){
    localStorage['america'] = $(this).arr("checked");
});

$('#select_all').click(selectAll);

$('#playbutton').click(function () {
      var categorylist = '';
      var checkboxes = document.getElementsByTagName("input");
      var len = checkboxes.length;
      for (var i=0; i < len; i++) {
          if (checkboxes[i].type == "checkbox" && checkboxes[i].checked && checkboxes[i].id != 'international-switch') {
              categorylist += checkboxes[i].id + " ";
          }
      }
      if (categorylist.trim() == '') {
          alert("You forgot to select any categories!");
          return;
      } 

      localStorage.setItem('categorylist', categorylist.trim());
      window.location.assign("game/index.html");
});


