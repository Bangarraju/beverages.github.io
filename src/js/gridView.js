//importing ag-grid modules
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { Grid } from 'ag-grid-community';
// import {Grid} from 'ag-grid-enterprise';

//importing user define modules
import Service from './service';
import { createNode,changeQueueDomElements } from './nodeOperations';


const service = Service //service object for getting orders data

//defining headers of the table or Grid
let columnDefs = [
  {
    headerName: "Name", 
    field: "customerName", 
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
  },
  { headerName: "Phone number", field: "phoneNumber", editable: true },
  { headerName: "Order Name", field: "OrderedBeverage.Name" },
  {
    headerName: "Order Status", 
    field: "status", 
    editable: true, 
    cellEditor: 'agRichSelectCellEditor',
    cellEditorParams: function (params) {
      let status = params.data.status
      if (status == 'In Queue') {
        return {
          values: ['In Queue', 'Being Mixed', 'Ready to Collect', 'Collected']
        }
      } else if (status == 'Being Mixed') {
        return {
          values: ['Being Mixed', 'Ready to Collect', 'Collected']
        };
      } else if (status == 'Ready to Collect') {
        return {
          values: ['Ready to Collect', 'Collected']
        };
      } else if (status == 'Collected') {
        return {
          values: ['Collected']
        };
      }
    }
  },
  { headerName: "Order Collected Date", field: "OrderDeliveredTime" },
  { headerName: "Address", field: "address" },
];

//options to resize and filtering for data and for assign columndefs to table
let gridOptions = {
  defaultColDef: {
    sortable: true,
    resizable: true,
    selectable: true,
    filter: true,
    flex: 1,
    minWidth: 150,
  },
  suppressRowClickSelection: true,
  groupSelectsChildren: true,
  enableRangeSelection: true,
  // rowModelType:'serverSide',
  columnDefs: columnDefs, //for adding headers to the table
  pagination: true,
  paginationPageSize: 3, //by default pagination page size
  paginationNumberFormatter(params) {
    return '[' + params.value.toLocaleString() + ']';
  },
  onCellValueChanged: onCellValueChanged,
};

function onCellValueChanged(params) {
  let beverage = {}
  let colId = params.column.getId();
  let beverageId = params.data.id;
  const url = `/BeveragesQueue/${beverageId}`;

  //changed in status 
  if (colId === 'status') {
    let beverageStatus = params.data.status
    let clickLiele = document.getElementById(beverageId).parentElement;
    if (beverageStatus == 'Being Mixed') {
      beverage.IsBeingMixed = true;
      //dom element changes
      changeQueueDomElements(clickLiele,'inQueue','isBeingMixed')
    }
    if (beverageStatus == 'Ready to Collect') {
      beverage.IsReadyToCollect = true;
      //dom element changes
      changeQueueDomElements(clickLiele,'isBeingMixed','isReadyToCollect')
    }
    if (beverageStatus == 'Collected') {
      beverage.IsCollected = true;
      //dom element changes
      document.getElementById(beverageId).firstChild.lastElementChild.hidden = false; 
      document.getElementById(beverageId).lastElementChild.lastElementChild.hidden = false;
      changeQueueDomElements(clickLiele,'isReadyToCollect','isCollected')
    }
  }
  if (colId === 'phoneNumber') {
    beverage.phoneNumber = params.data.phoneNumber;
  }
  //send changed data to server 
  service.sendRequest(url, 'PATCH', beverage, handleRequst)
  //callback function to handle request of patch 
  function handleRequst(status, data) {
    if (status == 200) {
      console.log('patched data sucess')
    } else {
      console.log('patch failed')
    }
  }
}

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
        rowdata.status = rowdata.IsCollected ? 'Collected' : (rowdata.IsReadyToCollect ? 'Ready to Collect' : (rowdata.IsBeingMixed ? 'Being Mixed' : 'In Queue'));
        rowdata.OrderDeliveredTime = rowdata.IsCollected ? date.toDateString() : '';
      })
      gridOptions.api.setRowData(rowdata);
      // gridOptions.api.setServerSideDatasource(rowdata);
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