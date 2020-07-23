import { createNode, append } from './nodeOperations';
import Beverage from './beverage';

import '../styles/form.scss'

const beverage = Beverage;

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

//validate form weather the fields are filled or not
const validateform = function () {
    let form = document.forms["orderForm"];
    let customerName = form["customerName"].value;
    let beverage = form["beverage"].value;
    let phoneNumber = form["phoneNumber"].value;
    if (customerName !== "" && beverage !== "" && phoneNumber !== "") {
        return true;
    } else {

        (customerName == "" || customerName == null) ? addClassToElement('customerName','required')
                                                    : removeClassToElement('customerName','required'); 

        (beverage == "" || beverage == null) ? addClassToElement('beverage','required')
                                            : removeClassToElement('beverage','required');
        
        (phoneNumber == "" || phoneNumber == null) ? addClassToElement('phoneNumber','required')
                                                  : removeClassToElement('phoneNumber','required') 
        return false;
    }
    function addClassToElement(ElementName, className){
        form[ElementName].classList.add(className)
    }
    function removeClassToElement(ElementName,className){
        form[ElementName].classList.remove(className)
    }
}

//validation of phone number 
function validatePhoneNumber(data){
    let phoneNumber = document.forms["orderForm"]["phoneNumber"].value
    console.log(typeof phoneNumber)
    var phoneRegex = /^\d{10}$/;
    if(phoneNumber.length>0 && phoneNumber.match(phoneRegex))
    {
        document.getElementById('phoneErrorMessage').innerText = '';
        return true;
    }else
    {
        document.getElementById('phoneErrorMessage').innerText = '* rquired digits and 10 digit phone number'
        return false;
    }
}

window.onload = function () {
    setdropdownList();
    document.orderForm.onsubmit = (e) => {
        if (validateform() && validatePhoneNumber() ) {
            beverage.orderBeverage(e);
        } else {
            e.preventDefault();
            document.getElementById("errorMessage").innerText = "* Some fields required"
        }
    }

    //onBlur on phone number field
    $("input[name='phoneNumber']").on("blur",function () {
        if(validatePhoneNumber()){
            this.classList.remove('required')
        }else {
            this.classList.add('required')
        }
    })

    //onblur on customerName field of form
    $("input[name='customerName']").on("blur",function () {
        if(this.value){
            this.classList.remove('required')
        }else{
            this.classList.add('required')
        }
    })

    //onblur on select field
    $("select").on("blur",function(){
        this.classList.remove('required')
    })
        
}