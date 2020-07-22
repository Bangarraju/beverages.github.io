import Service from './service';
import { append } from './nodeOperations';

var service = Service;

class Beverage{

    constructor(){
        this.customerName = '';
        this.phoneNumber = '';
        this.address = '';
        this.OrderCreatedTimeStamp= Date.now();
        this.BeverageBarOrderId = Math.random();
        this.OrderedBeverage = {
            BeverageId: "",
            Name: ""
        };
        this.IsBeingMixed =  false;
        this.IsReadyToCollect = false;
        this.IsCollected = false;
        this.OrderDeliveredTimeStamp = Date.now();
    }


    //funciton for take ordering beverage and post it into the server
    orderBeverage(event) {
        event.preventDefault();
        const url = "/BeveragesQueue";
        var formdata = new FormData(formele);
        var selector = document.getElementById('menuDropdown');
        this.OrderedBeverage.BeverageId = selector[selector.selectedIndex].id;
        this.OrderedBeverage.Name = formdata.get('beverage')
        this.customerName = formdata.get('customerName')
        this.phoneNumber = formdata.get('phoneNumber')
        this.address = formdata.get('address')
        service.sendRequest(url, 'POST', this, postStatus,)
        function postStatus(status, data) {
            if (status == 201) {
                window.open('index.html', '_self')
            } else {
                console.log(status)
            }
        }
    }

    //changeing queue elements when click event is happen
    changeQueue(event) {

        event.preventDefault();
        const clickId = event.path[2].id;
        const itemId = event.target.id;
        const url = `/BeveragesQueue/${itemId}`;
        var clickLiele = document.getElementById(itemId).parentElement;
        var currentStateEle = document.getElementById(clickId);
        if (clickId == "inQueue") {
            this.IsBeingMixed = true;
            let nextStateEle = document.getElementById('isBeingMixed');
            currentStateEle.removeChild(clickLiele);
            append(nextStateEle, clickLiele);
        } else if (clickId == "isBeingMixed") {
            this.IsReadyToCollect = true;
            let nextStateEle = document.getElementById('isReadyToCollect');
            currentStateEle.removeChild(clickLiele);
            append(nextStateEle, clickLiele);
        } else if (clickId == "isReadyToCollect") {
            this.IsCollected = true;
            document.getElementById(itemId).firstChild.lastElementChild.hidden = false;
            document.getElementById(itemId).lastElementChild.lastElementChild.hidden = false;
            this.OrderDeliveredTimeStamp = Date.now();
            let nextStateEle = document.getElementById('isCollected');
            currentStateEle.removeChild(clickLiele);
            append(nextStateEle, clickLiele);
        }


        service.sendRequest(url, 'PATCH', this, (response, data) => { console.log(response) },)
    }
}

export default new Beverage