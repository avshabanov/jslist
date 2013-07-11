/**
 * @author avshabanov
 * contains VirtualList description.
 * VirtualList is a class that provides support for lists with
 * virtualization capabilities.
 */


/**
 * VirtualList class constructor
 * Accepts ItemProvider that is expected to provide the following functions:
 *  - create(index) to allocate new item node
 *  - free(node) to remove item node
 *  - count() to retrieve total nodes count to be represented in the virtual list
 *  - indexOf(node) to retrieve index from the item node given:
 *                all nodes expected to be sequentially associated with integer indexes from 0 to count,
 *                e.g. the very first node shall have 0 index, (count-1) shall be associated with the last one.
 * @param {Object} holderNode html node that will serve as a container for items
 * @param {Object} itemProvider provider for the child nodes.
 */
function VirtualList(){
}


VirtualList.prototype = {
    /**
     * pad node that serves as an unmovable layout for scrollContainerNode,
     * this node represents viewport area
     */
    padNode: null,
    
    /**
     * represents scrollable area, expected to be a child of the pad node 
     */
    scrollableNode: null,
    
    /**
     * node, that serves as a container for list items, it shall be
     * child of or scrollNode itself
     * WARNING: this node shall contain only nodes produced by the given itemProvider!
     */
    containerNode: null,
    
    /**
     * outer items provider object
     */
    itemProvider: null,
    
    viewportTop: null,
    viewportBottom: null,
    
    bindToSingleContainer: function(holderNode){
        removeAllChilds(holderNode);
        
        // create pad
        this.padNode = document.createElement("div");
        this.padNode.setAttribute('style', 'height: 100%; overflow-y: hidden;');
        holderNode.appendChild(this.padNode);
        
        // create scroll container
        var scrollContainerNode = document.createElement("div");
        scrollContainerNode.setAttribute('style', 'position: relative');
        this.padNode.appendChild(scrollContainerNode);
        
        this.containerNode = scrollContainerNode;
        this.scrollableNode = scrollContainerNode;
    },
    
    /**
     * removes node given
     * @param {Object} node
     */
    internalRemoveNode: function(node){
        this.containerNode.removeChild(node);
        this.itemProvider.free(node);
    },
	
	/**
	 * scrolls by a given vertical offset
	 * FIXME: in order to improve performance this function might be split to
	 * the following ones:
	 *     scroll up (includes stages [1], [3], [5])
	 *     scroll down (includes stages [2], [4], [5])
	 * @param {Object} y
	 */
	scrollBy: function(verticalDelta) {
        // static viewport area
        var viewportTop = this.padNode.offsetTop;
        var viewportBottom = this.padNode.offsetTop + this.padNode.offsetHeight;
        
        // new top of the scrollable container
        var newScrollTop = this.scrollableNode.offsetTop + verticalDelta; 
        
		// [1] prepend items to top if needed
        for (;;) {
            if (newScrollTop <= viewportTop) {
                break; // top-part has sufficient number of items
            }
            
            var firstChild = this.containerNode.firstChild;
            var index = this.itemProvider.indexOf(firstChild);
            if (index == 0) {
                // nothing to add, viewport is about to be overscrolled, stick it to the viewport top
                newScrollTop = viewportTop;
                break;
            }
            
            var prevNode = this.itemProvider.create(index - 1);
            this.containerNode.insertBefore(prevNode, firstChild);
            newScrollTop -= prevNode.offsetHeight; // fix scroll top since upper bound grew up
        }
        
        // [2] append items to bottom if needed
        for (;;) {
            var lastChild = this.containerNode.lastChild;
            var lastBottom = newScrollTop + lastChild.offsetTop + lastChild.offsetHeight; 
            if (lastBottom > viewportBottom) {
                break; // bottom-part has sufficient number of items
            }
            
            var nextIndex = this.itemProvider.indexOf(lastChild) + 1;
            if (nextIndex == this.itemProvider.count()) {
                // nothing to add, viewport overscrolled, newScrollTop has to be fixed.
                // TODO: scroll up, or, if items number is too little, scroll to the very first item
                // FIXME: get rid of temporary solution that set newScrollTop
                // in the way the last item will be exactly at the bottom
                newScrollTop -= (lastBottom - viewportBottom);  
                break;
            }
            
            var nextNode = this.itemProvider.create(nextIndex);
            this.containerNode.appendChild(nextNode);
        }
        
        // [3] remove redundant items from top
        for (;;) {
            var firstChild = this.containerNode.firstChild;
            if ((newScrollTop + firstChild.offsetTop + firstChild.offsetHeight) > viewportTop) {
                break; // this item and the others can not be removed
            }
            
            // this item can be removed without affecting performance
            newScrollTop += firstChild.offsetHeight; // fix new scroll top
            this.internalRemoveNode(firstChild);
        }
        
        // [4] remove redundant items from bottom
        for (;;) {
            var lastChild = this.containerNode.lastChild;
            if ((newScrollTop + lastChild.offsetTop) < viewportBottom) {
                break; // this item and the others can not be removed
            }
            
            // this item can be removed without affecting performance
            this.internalRemoveNode(lastChild);
        }
        
        // [5] set new scroll top
        this.scrollableNode.style.top = (newScrollTop - viewportTop) + 'px';
	},
    
    /**
     * rebuilds contents of the virtual list starting from the index given
     * @param {Object} index
     */
    rebuild: function(index) {
        // move to the initial state
        this.scrollableNode.style.top = 0;
        while (this.containerNode.lastChild != null) {
            this.internalRemoveNode(this.containerNode.lastChild);
        }
        
        var count = this.itemProvider.count();
        var viewportHeight = this.padNode.offsetHeight;
        
        if (index >= 0 && index < count) {
            // append "lower" nodes
            for (var i = index; i < count; ++i) {
                var newNode = this.itemProvider.create(i);
                this.containerNode.appendChild(newNode);
                if (this.scrollableNode.offsetHeight > viewportHeight) {
                    return; // contents fit viewport margins
                }
            }
            
            // too few nodes added, prepend "upper" nodes
            for (var i = index - 1; i >= 0; --i) {
                var newNode = this.itemProvider.create(i);
                this.containerNode.insertBefore(newNode, this.containerNode.firstChild);
                if (this.scrollableNode.offsetHeight > viewportHeight) {
                    return; // contents fit viewport margins
                }
            }
        }
        else {
            throw new Error("invalid argument: index shall be less than item count and not less than zero");
        }
    }
}

