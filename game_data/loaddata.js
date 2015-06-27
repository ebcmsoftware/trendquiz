var america = localStorage['america'];
if (america === undefined) america = 'true';

var categorylist = localStorage.getItem('categorylist').split(" ");
//i'm doing this in case they somehow get linked to /index without first visiting /trendquiz
if (!categorylist || categorylist == '') 
    window.location.assign('/');

if (categorylist.indexOf("internet_memes") > -1) topicsArray = topicsArray.concat(internet_memes);
if (categorylist.indexOf("misc_seasonal") > -1) topicsArray = topicsArray.concat(misc_seasonal);
if (categorylist.indexOf("politics") > -1) topicsArray = topicsArray.concat(politics);
if (categorylist.indexOf("sports") > -1) topicsArray = topicsArray.concat(sports);
if (categorylist.indexOf("games") > -1) topicsArray = topicsArray.concat(games);
if (categorylist.indexOf("tech") > -1) topicsArray = topicsArray.concat(tech);
if (categorylist.indexOf("music") > -1) topicsArray = topicsArray.concat(music);
if (categorylist.indexOf("visualmedia") > -1) topicsArray = topicsArray.concat(visualmedia);

if (america == "false") {
    topicsArray = topicsArray.filter(function(elt) {
        return elt.america;
    });
    //this is jank as heck
    if (categorylist.indexOf("sports") > -1) topicsArray = topicsArray.concat(intl_sports);
}

