//importing ag-grid modules
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Grid } from 'ag-grid-community';

//importing user define modules
import Service from './service';
import { createNode } from './nodeOperations';

const service = Service //service object for getting orders data

//defining headers of the table or Grid
let columnDefs = [
  { headerName: "Name", field: "customerName" },
  { headerName: "Phone number", field: "phoneNumber" },
  { headerName: "Order Name", field: "OrderedBeverage.Name" },
  { headerName: "Order Status", field: "status" },
  { headerName: "Order Collected Date", field: "OrderDeliveredTime" },
  { headerName: "Address", field: "address" },
];

//options to resize and filtering for data and for assign columndefs to table
let gridOptions = {
  defaultColDef: {
    sortable: true,
    resizable: true,
    filter: true,
    flex: 1,
    minWidth: 150,
  },
  suppressRowClickSelection: true,
  groupSelectsChildren: true,
  enableRangeSelection: true,
  columnDefs: columnDefs, //for adding headers to the table
  pagination: true,
  paginationPageSize: 3, //by default pagination page size
  paginationNumberFormatter(params) {
    return '[' + params.value.toLocaleString() + ']';
  },
};

//if page size changes, it sets pagination size
export function onPageSizeChanged(newPageSize) {
  let value = document.getElementById('page-size').value;
  gridOptions.api.paginationSetPageSize(Number(value));
}

//show data in Grid i.e., in table 
export function gridView() {

  //get orders from the server and set it into the Grid
  service.get("/BeveragesQueue", setRowData)
  //callback function to set data in Grid
  function setRowData(status, data) {
    if (status == 200 && data.length) {
      let rowdata = data
      rowdata.map((rowdata) => {
        let date = new Date(rowdata.OrderDeliveredTimeStamp);
        rowdata.status = rowdata.IsCollected ? 'Collected' : (rowdata.IsReadyToCollect ? 'Ready to Collect' : (rowdata.IsBeingMixed ? 'Mixing' : 'In Queue'));
        rowdata.OrderDeliveredTime = rowdata.IsCollected ? date.toDateString() : '';
      })
      gridOptions.api.setRowData(rowdata);
    }
  }

  //get Grid element to show grid
  let eGridDiv = document.querySelector('#grid');
  new Grid(eGridDiv, gridOptions); //enebling Grid and sending data and corresponding settings to the Grid class to ag-Grid

  //setting user defined pagination in the paging div
  let pagingDiv = createNode('div')
  pagingDiv.classList.add('example-wrapper')
  pagingDiv.innerHTML = `<div class="example-header">
                        Page Size:
                        <select onchange="" id="page-size">
                          <option value="3" selected>3</option>
                          <option value="6">6</option>
                          <option value="9">9</option>
                        </select>
                      </div>`
  document.getElementsByClassName('ag-paging-panel')[0].append(pagingDiv) //append that div into grid
}