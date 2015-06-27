var toggle = false;
//function for trendquiz.html
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

localStorage['score'] = 0;
localStorage['num_answered'] = 0;

document.getElementById('select_all').addEventListener('click', selectAll);

document.getElementById('playbutton').addEventListener('click', function () {
      var categorylist = '';
      var checkboxes = document.getElementsByTagName("input");
      var len = checkboxes.length;
      for (var i=0; i < len; i++) {
          if (checkboxes[i].type == "checkbox" && checkboxes[i].checked) {
              categorylist += checkboxes[i].id + " ";
          }
      }
      if (categorylist.trim() == '') {
          alert("You forgot to select any categories!");
          return;
      } 

      localStorage.setItem('categorylist', categorylist.trim());
      window.location.assign("data/index.html");
});


