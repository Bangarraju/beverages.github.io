import { createNode, append } from './nodeOperations';
import Beverage from './beverage';

import '../styles/form.scss'

var beverage = Beverage;

//set the option elements into dorpdown 
function setdropdownList() {
    const select = document.getElementById('menuDropdown');
    if (localStorage.getItem('menu')) {
        let menu = JSON.parse(localStorage.getItem('menu'));
        menu.map(function (item) {
            let option = createNode('option');
            option.text = `${item.Name}`;
            option.id = `${item.BeverageId}`;
            select.add(option);
        })
    }
}

var validateform = function () {
    var form = document.forms["orderForm"];
    var customerName = form["customerName"].value;
    var beverage = form["beverage"].value;
    var phoneNumber = form["phoneNumber"].value;
    if (customerName !== "" && beverage !== "" && phoneNumber !== "") {
        return true;
    } else {

        (customerName == "" || customerName == null || customerName == undefined)?form["customerName"].classList.add('required')
                                                                                :form["customerName"].classList.remove('required'); 

        (beverage == "" || beverage == null || beverage == undefined)?form["beverage"].classList.add('required')
                                                                    :form["beverage"].classList.remove('required'); 
        
        (phoneNumber == "" || phoneNumber == null || phoneNumber == undefined)?form["phoneNumber"].classList.add('required')
                                                                    :form["phoneNumber"].classList.remove('required'); 
        return false;
    }
}



window.onload = function () {
    setdropdownList();
    document.orderForm.onsubmit = (e) => {
        if (validateform()) {
            beverage.orderBeverage(e);
        } else {
            event.preventDefault();
            document.getElementById("errorMessage").innerText = "* Some fields required"
        }
    }
}