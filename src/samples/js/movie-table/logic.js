/**
 * @author avshabanov
 * logic for ungrouped movie list
 */

var prevSelectedNode = null;

function setFilmData(node, dataPos, data) {
	var pos = byClass(node, "jb-pos");
	var actor = byClass(node, "jb-actor");
	var title = byClass(node, "jb-title");
	var duration = byClass(node, "jb-duration");
	
	pos.textContent = dataPos;
	actor.textContent = data.actor;
	title.textContent = data.title;
	duration.textContent = data.duration;
    
    node.onclick = function() {
        if (prevSelectedNode != null) {
            removeClassName(prevSelectedNode, "jb-selected-item");
        }
        
        addClassName(node, "jb-selected-item");
        prevSelectedNode = node;
    }
}

/* onload */

window.onload = function(){
    try {
        byId("jb-table-title").textContent = "Comedy movies table";
		
		var list = byId("jb-list");
		var item = byClass(list, "jb-item");
		
		removeAllChilds(list);
		
		var films = createFilmsArray(7);
		for (i = 0; i < films.length; ++i) {
			var data = films[i];
			var node = item.cloneNode(true);
			
			setFilmData(node, i + 1, data);
			
			list.appendChild(node);
		}
    } 
    catch (err) {
        reportError(err);
    }
}
