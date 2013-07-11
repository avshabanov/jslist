/**
 * @author avshabanov
 * contains Datasource definition.
 */

var sampleFilms = new Array(
    "Groundhog Day",
    "Van Wilder",
    "Office Space",
    "Meet the Parents",
    "Coming to America",
    "Monty Python and the Search for the Holy Grail",
    "K-9",
    "What About Bob?");
    
var sampleActors = new Array(
    "Bill Murray",
    "Tara Reid",
    "Andie MacDowell",
    "Chris Elliott",
    "Richard Dreyfuss",
    "Jack Nicholson",
    "Ryan Reynolds");
    
function randFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}


function createFilmsArray(filmCount) {
    var result = new Array();
	
	if (!filmCount) {
		filmCount = 20;
	}
	
	if (typeof(filmCount) != "number") {
		throw new Error("invalid argument filmCount");
	}
    
    for (var i = 0; i < filmCount; ++i) {
        var filmInfo = new FilmInfo();
        filmInfo.title = randFromArray(sampleFilms);
        filmInfo.actor = randFromArray(sampleActors);
        filmInfo.duration = 50 + Math.floor(Math.random() * 80);
		filmInfo.isFavorite = ((i % 7) == 1);
        
        result.push(filmInfo);
    }
    
    return result;
}

/**
 * ctor of film info class 
 */
function FilmInfo() {
}


FilmInfo.prototype = {
    title: null,
    actor: null,
    duration: 0,
	isFavorite: false
}
