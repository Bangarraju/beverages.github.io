var localStorage = window.localStorage; // local storage object 

//set menu list into local storage
var fetchMenu =(async function(){
    const url = "http://localhost:3000/BeveragesMenu";
    let response = await fetch(url);
    let data = await response.json();
    localStorage.setItem('menu',JSON.stringify(data));
})();
//append each order into the Beverage Queue and other list too
function appendItemsintoList(item,ul){
    let li = createNode('li');
    let beverageDiv = createNode('div');
    let customerDiv = createNode('div');
    let maindiv = createNode('div');
    beverageDiv.innerText =  `${item.OrderedBeverage.Name}`;
    customerDiv.innerText = `${item.customerName}`;
    maindiv.id = `${item.id}`;
    beverageDiv.classList.add('beverage');
    customerDiv.classList.add('customer');
    maindiv.classList.add('order');
    maindiv.addEventListener('click',changeQueue);
    maindiv.append(beverageDiv,customerDiv);
    append(li,maindiv);
    append(ul,li);
}

// get fetchorder response 
var fetchOrders = (async function(){
    const url = "http://localhost:3000/BeveragesQueue";
    let response = await fetch(url);
    return response
})();

//setting menu into list and append into dom elements
function beveragesMenu(){
    const ul = document.getElementById('beverageMenu');
    let menu = JSON.parse(localStorage.getItem('menu'));
    menu.map(function(item){
        let li = createNode('li');
        let div = createNode('div');
        div.innerText =  `${item.Name}`;
        div.classList.add('menuItem');
        append(li,div);
        append(ul,li);
    })
}
//fetching orders and set into list and append those to dom elements
function beveragesQueue(){
    queueUl = document.getElementById('inQueue');
    mixedUl = document.getElementById('isBeingMixed');
    collectUl = document.getElementById('isReadyToCollect');
    fetchOrders
    .then((resp)=>resp.json())
    .then(
        function(data){
            let mixedItems = data.filter(item=>item.IsBeingMixed && !item.IsReadyToCollect && !item.IsCollected);
            let readyToCollectItems = data.filter(item => item.IsReadyToCollect && !item.IsCollected);
            let inQueueItems = data.filter(item => !item.IsCollected && !item.IsReadyToCollect && !item.IsBeingMixed);
            inQueueItems.map(
                (item)=>appendItemsintoList(item,queueUl)
            );
            mixedItems.map(
                (item) => appendItemsintoList(item,mixedUl)
            );
            readyToCollectItems.map(
                (item) => appendItemsintoList(item,collectUl)
            );
        }
    )
}
//changeing queue elements when click event is happen
function changeQueue(event){
    const url = "http:localhost:3000/BeveragesQueue/";
    event.preventDefault();
    const clickUlId = event.path[2].id;
    const itemId = event.target.id;
    clickLiele = document.getElementById(itemId).parentElement;
    currentStateEle = document.getElementById(clickUlId);
    if(clickUlId == "inQueue"){
        this.IsBeingMixed = true;
        nextStateEle = document.getElementById('isBeingMixed');
        currentStateEle.removeChild(clickLiele);
        append(nextStateEle,clickLiele);
    }else if(clickUlId == "isBeingMixed"){
        this.IsReadyToCollect = true;
        nextStateEle = document.getElementById('isReadyToCollect');
        currentStateEle.removeChild(clickLiele);
        append(nextStateEle,clickLiele);
    }else if(clickUlId == "isReadyToCollect"){
        this.IsCollected = true;
        this.OrderDeliveredTimeStamp = Date.now();
        nextStateEle = document.getElementById('isBeingMixed');
        currentStateEle.removeChild(clickLiele);
    }
    //send changed data into the server
    fetch(url + itemId,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(this),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

window.onload = function(){
    beveragesMenu();
    beveragesQueue();
    localStorage.clear()
}
