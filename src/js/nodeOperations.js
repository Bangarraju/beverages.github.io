export function createNode(element){
    return document.createElement(element);
}

export function append(parent, element){
    return parent.appendChild(element);
}

export function changeQueueDomElements(clickElement, currentStateId, nextStateId){
    let currentStateElement = document.getElementById(currentStateId);
    let nextStateElement = document.getElementById(nextStateId);
    currentStateElement.removeChild(clickElement);
    append(nextStateElement, clickElement);
}