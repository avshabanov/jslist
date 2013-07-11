/**
 * @author avshabanov
 * logic for ungrouped movie list
 */

function createMovieNode(templateNode){
    var result = templateNode.cloneNode(true);
    
    var movieTitle = byClass(result, "jb-title");
    var movieDuration = byClass(result, "jb-duration");
    var movieActor = byClass(result, "jb-actor");
    
    // create attached node updater
    result.updateData = function(titleData, actorData, durationData) {
        movieTitle.textContent = titleData;
        movieDuration.textContent = durationData;
        movieActor.textContent = actorData;
    };
    
    return result;
}

function handleKeyEvent(virtualList, scrollBy, keyEvent) {
    switch (keyEvent.keyCode) {
        case 38: // up
            scrollBy(1);
            break;
        case 40: // down
            scrollBy(-1);
            break;
        case 33: // pg up
            scrollBy(100);
            break;
        case 34: // pg down
            scrollBy(-100);
            break;
        case 32: // space [for debugging purposes]
            var firstItem = virtualList.containerNode.firstChild;
            var lastItem = virtualList.containerNode.lastChild;
            var itemProvider = virtualList.itemProvider;
            alert("visible items range: " + itemProvider.indexOf(firstItem) + ", " +
                  itemProvider.indexOf(lastItem));
            break;
    }
}

window.onload = function(){
    try {
        byId("jb-list-title").textContent = "Comedy Movies";
        
        var movieList = byId("jb-list");
        var movieItemTemplate = byClass(movieList, "jb-item");
        removeAllChilds(movieList);
        
        var films = createFilmsArray();
        
        // initialize our item provider
        var itemProvider = createItemProvider(function(index){
            var node = createMovieNode(movieItemTemplate);
            var data = films[index];
            node.updateData(index + ". " + data.title, data.actor, data.duration);
            return node;
        }, films.length);
        
        var virtualList = new VirtualList();
        virtualList.itemProvider = itemProvider;
        virtualList.bindToSingleContainer(movieList);
        
        // populate list's content starting from the very first item
        virtualList.rebuild(0);
        
        // scroll bar part
        var scrollBarHolder = byId("jb-scrollbar-holder");
        var thumb = byClass(scrollBarHolder, "jb-scrollbar-thumb");
        var updateThumbPos = function(){
            var visibleItemsCount = virtualList.containerNode.children.length;
            var firstItemIndex = itemProvider.indexOf(virtualList.containerNode.firstChild);
            var maxTop = scrollBarHolder.offsetHeight - thumb.offsetHeight;
            var count = itemProvider.count() - visibleItemsCount;
            var top = (firstItemIndex * maxTop) / count;
            
            thumb.style.top = top + 'px';
        }
        
        // scrollBy function that triggers scrollbar
        var scrollBy = function(y){
            virtualList.scrollBy(y);
            updateThumbPos();
        };
        
        installMouseWheelHandler(window, function(wheelDelta){
            scrollBy(wheelDelta < 0 ? -60 : 60);
        });
        
        window.onkeydown = function(keyEvent){
            handleKeyEvent(virtualList, scrollBy, keyEvent);
        };
    } 
    catch (err) {
        reportError(err);
    }
}
