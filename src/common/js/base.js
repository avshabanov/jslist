/**
 * @author avshabanov
 * base functions for
 * - locating certain element
 * - error reporting
 * - child nodes removal
 */


/**
 * removes all the child nodes from the node given
 * @param {Object} node
 */
function removeAllChilds(node){
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
}

/**
 * returns found element or throws exception if it has not been found
 * @param {Object} id identifier of element
 */
function byId(id){
    var result = document.getElementById(id);
    if (result == null) {
        throw new Error("There is no element with id=" + id);
    }
    return result;
}

/**
 * returns element that has the given class in the element's subtree, throws exception if
 * there is no such element or if there are more than one elements there
 * @param {Object} element
 * @param {Object} className
 */
function byClass(element, className){
    var elements = element.getElementsByClassName(className);
    
    if (elements.length == 1) {
        return elements[0];
    }
    else {
        if (elements.length == 0) {
            throw new Error("There is no element with class=" + className + " in the element " + element);
        }
    }
    
    // multiple choices are not allowed
    throw new Error("Multiple choices for element with class=" + className + " in the element " + element);
}

/**
 * converts function to string truncating it's body
 * @param {Object} func
 */
function funcToString(func) {
    var funcStr = func.toString();
    var bodyIndex = funcStr.indexOf('{');
    if (bodyIndex > 0) {
        return funcStr.substring(0, bodyIndex - 1);
    }
    
    return funcStr;
}

function toReadableString(obj, level) {
    if (level == null) {
        level = 0;
    }

    if (typeof(obj) != "object") {
        return obj.toString();
    }

    var result = "{";
    var isFirst = true;
    for (var i in obj) {
        var val = obj[i];
        result += (isFirst ? " " : ", ") + i + ": ";
        isFirst = false;

        if (typeof(val) == "object" && level > 0) {
            result += toReadableString(val, level - 1);
        }
        else {
            result += val.toString();
        }
    }
    
    result += (isFirst ? "" : " ") + "}";
    return result;
}

/**
 * reports about an error to the user with detailed error description and information about caller
 * @param {Object} err
 */
function reportError(err){
    alert("error: " + toReadableString(err, 2) +
          "\ncaller: " + funcToString(arguments.callee.caller));
}

/**
 * mouse wheel installer for Chrome and Mozilla
 * @param {Object} element
 * @param {Object} onWheel
 */
function installMouseWheelHandler(element, onWheel){
	// Mozilla-specific mouse wheel
	element.addEventListener('DOMMouseScroll', function(e){
		onWheel(-e.detail);
	}, false);
	
	// Chrome-specific mouse wheel
	element.onmousewheel = function(e){
		onWheel(e.wheelDelta);
	}
}

/**
 * safely adds class name to the existing ones to the element given.
 * if the given class name exists, nothing happens.
 * @param {Object} element
 * @param {Object} className
 */
function addClassName(element, className){
    var presentClasses = element.className.split(/\s+/);
    for (var i = 0; i < presentClasses.length; ++i) {
        if (presentClasses[i] == className) {
            return;
        }
    }
    
    // no such class, add this one
    element.className += (element.className.length > 0 ? " " : "") + className;
}

/**
 * removes class name if it exists among class names.
 * @param {Object} element
 * @param {Object} className
 */
function removeClassName(element, className){
    var presentClasses = element.className.split(/\s+/);
    var resultName = "";
    for (var i = 0; i < presentClasses.length; ++i) {
        var existingClassName = presentClasses[i];
        if (existingClassName != className) {
            resultName += (resultName.length > 0 ? " " : "") + existingClassName;
        }
    }
    
    element.className = resultName;
}
