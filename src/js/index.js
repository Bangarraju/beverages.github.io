import Service from './service';
import { createNode, append } from './nodeOperations';
import Beverage from './beverage';
import '../styles/main.scss';

var localStorage = window.localStorage; // local storage object 
var service = Service;
var beverage = Beverage;


service.get("/BeveragesMenu", setMenu)

function setMenu(status, data) {
    if (status === 200) {
        if (data.length) {
            localStorage.setItem('menu', JSON.stringify(data));
        } else {
            console.log('not get any data from server')
        }
    }
}


//append each order into the Beverage Queue and other list too
function appendItemsintoList(item, ul) {
    let li = createNode('li');
    let beverageDiv = createNode('div');
    let customerDiv = createNode('div');
    let maindiv = createNode('div');
    let date = new Date(item.OrderDeliveredTimeStamp);
    maindiv.id = `${item.id}`;
    if (ul !== document.getElementById('isCollected')) {
        beverageDiv.innerHTML = `<b>${item.OrderedBeverage.Name}</b><br/><span hidden>${date? date.toDateString() :''}</span>`;
        customerDiv.innerHTML = `<b>${item.customerName}</b><br/><span hidden> ${item.phoneNumber?item.phoneNumber:''}<br/> ${item.address? item.address : ''}</span>`;
        maindiv.addEventListener('click', beverage.changeQueue);
    }else{
        beverageDiv.innerHTML = `<b>${item.OrderedBeverage.Name}</b><br/><span>${date? date.toDateString() :''}</span>`;
        customerDiv.innerHTML = `<b>${item.customerName}</b><br/><span> ${item.phoneNumber?item.phoneNumber:''}<br/> ${item.address? item.address : ''}</span>`;
    }
    beverageDiv.classList.add('beverage');
    customerDiv.classList.add('customer');
    maindiv.classList.add('order');
    maindiv.append(beverageDiv, customerDiv);
    append(li, maindiv);
    append(ul, li);
}


//setting menu into list and append into dom elements
function beveragesMenu() {
    const ul = document.getElementById('beverageMenu');
    if (localStorage.getItem('menu')) {
        let menu = JSON.parse(localStorage.getItem('menu'));
        menu.map(function (item) {
            let li = createNode('li');
            let div = createNode('div');
            div.innerText = `${item.Name}`;
            div.classList.add('menuItem');
            append(li, div);
            append(ul, li);
        })
    }
}

//fetching orders and set into list and append those to dom elements
function beveragesQueue() {
    let queueElement = document.getElementById('inQueue');
    let mixedElement = document.getElementById('isBeingMixed');
    let readyToCollectelement = document.getElementById('isReadyToCollect');
    let collectedElement = document.getElementById('isCollected');
    function orderList(status, data) {
        if (status === 200 && data.length) {
            let beingMixedItems = data.filter(item => item.IsBeingMixed && !item.IsReadyToCollect && !item.IsCollected);
            let readyToCollectItems = data.filter(item => item.IsReadyToCollect && !item.IsCollected);
            let inQueueItems = data.filter(item => !item.IsCollected && !item.IsReadyToCollect && !item.IsBeingMixed);
            let collectedItems = data.filter(item => item.IsCollected);
            inQueueItems.map(
                (item) => appendItemsintoList(item, queueElement)
            );
            beingMixedItems.map(
                (item) => appendItemsintoList(item, mixedElement)
            );
            readyToCollectItems.map(
                (item) => appendItemsintoList(item, readyToCollectelement)
            );
            collectedItems.map(
                (item) => appendItemsintoList(item, collectedElement)
            )
        }
    }
    service.get("/BeveragesQueue", orderList)
}



window.onload = function () {
    beveragesMenu();
    beveragesQueue();

    document.getElementById('switchView').onclick = () => {
        if (document.getElementById('completedOrdersContainer').hidden) {
            document.getElementById('completedOrdersContainer').hidden = false;
            document.getElementById('queueContainer').hidden = true;
        } else {
            document.getElementById('completedOrdersContainer').hidden = true;
            document.getElementById('queueContainer').hidden = false;
        }
    }
    localStorage.clear()
}

