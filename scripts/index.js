(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
 (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
 m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
 })(window,document,'script','http://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-52539363-1', 'auto');
ga('send', 'pageview');

document.getElementById('modal_why').addEventListener('click', function(){pausegame();});
document.getElementById('charlieoptionbox').addEventListener('click', function() {
    localStorage.setItem('fuckyoueric', 1);
    alert("f you eric");
});

