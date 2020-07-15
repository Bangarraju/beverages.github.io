
var BeverageObject = {
    customerName : '',
    OrderCreatedTimeStamp : Date.now(),
    BeverageBarOrderId : Math.random(),
    OrderedBeverage : {
        BeverageId : "",
        Name : ""
    },
    IsBeingMixed : false,
    IsReadyToCollect : false,
    IsCollected : false,
    OrderDeliveredTimeStamp : Date.now()
}


//set the option elements into dorpdown 
function setdropdownList(){
    const select = document.getElementById('menuDropdown');
    let menu = JSON.parse(localStorage.getItem('menu'));
    menu.map(function(item){
        let option = createNode('option');
        option.text =  `${item.Name}`;
        option.id = `${item.BeverageId}`
        select.add(option);
    })
}

//funciton for take ordering beverage and post it into the server
async function orderBeverage(event){
    event.preventDefault();
    const url = "http:localhost:3000/BeveragesQueue";
    var formdata = new FormData(formele);
    var selector = document.getElementById('menuDropdown');
    this.BeverageObject.OrderedBeverage.BeverageId = selector[selector.selectedIndex].id;
    this.BeverageObject.OrderedBeverage.Name = formdata.get('beverage')
    this.BeverageObject.customerName = formdata.get('customerName')
    const data = this.BeverageObject;
    await fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
       alert("order successfully placed");
       window.open('index.html','_self')
    })
    .catch((error) => {
        console.log(error);
        alert("error while taking order");
    });
}

window.onload = function(){
    setdropdownList();
    document.orderForm.onsubmit = (e) => {
        orderBeverage(e);
    }

}