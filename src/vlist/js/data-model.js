/**
 * @author avshabanov
 * defines various data models and corresponding utilities
 */


/**
 * creates collection wrapper for the array given
 * @param {Object} arr static array that is expected to not to change during using of the returned static collection
 */
function createStaticCollectionWrapper(arr) {
    return {
        cur: null,
        
        moveTo: function(index) {
            if (index >= 0 && index < arr.length) {
                this.cur = arr[index];
            }
        },
        
        count: function() {
            return arr.length;
        },
        
        cursor: function() {
            return this.cur;
        }
    }
}

/**
 * creates cached wrapper to get views to homogeneous items that belongs to
 * certain fixed-size collection.
 * @param {Node} templateNode
 * @param {Function} createUpdateNodeFunc
 */
function createCachedWrapper(templateNode, createUpdateNodeFunc) {
    return {
        cache: new Array(),
        
        create: function(index){
            var result;
            if (this.cache.length) {
                result = this.cache.pop();
            }
            else {
                result = templateNode.cloneNode(true);
                result.updateNode = createUpdateNodeFunc(result);
            }
            
            result.updateNode(index);
            result.assocIndex = index;
            
            return result;
        },
        
        free: function(node){
            this.cache.push(node);
        },
        
        count: function(){
            return count;
        },
        
        indexOf: function(node){
            return node.assocIndex;
        }
    };
}

/**
 * creates simple item provider to be used with fixed size collection, the item
 * provider returned can be used with virtual list.
 * @param {Function} createNode
 * @param {Number} totalCount
 */
function createItemProvider(createNode, totalCount) {
    return {
        create: function(index){
            var node = createNode(index);
            node.assocIndex = index; // for later use in indexOf
            return node;
        },
        free: function(){
        },
        count: function(){
            return totalCount;
        },
        indexOf: function(node){
            return node.assocIndex;
        }
    };
}
