
let loggingCookies=false;

function saveTableData(table){
  saveTableDataToCookies(table);
}

function loadTableData(id){
  return loadTableDataFromCookies(id);
}

function saveSheetInfo(){

}

function loadSheetInfo(){

}

// Function to set a cookie
// Function to set a cookie with SameSite=None and Secure attributes
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));  // Set expiry time
  const expiresStr = "expires=" + expires.toUTCString();
  
  // Set cookie with SameSite=None and Secure attributes
  document.cookie = `${name}=${value};${expiresStr};path=/;SameSite=None;Secure`;
}

// Save table data (converted to JSON string) to cookies
function saveTableDataToCookies(table) {
  const tableData = table.getData();
  filename=table.options.persistenceID;

  const jsonData = JSON.stringify(tableData);  // Convert to JSON string
  setCookie(filename, jsonData, 7000000);  // Save cookie for 7 days
  if(loggingCookies) console.log("Table data saved to cookies! Name is "+filename);
}

// Function to get a cookie value by name
function getCookie(name) {
  const nameEq = name + "=";
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
      let c = cookies[i].trim();
      if (c.indexOf(nameEq) === 0) return c.substring(nameEq.length, c.length);
  }
  return null;
}

// Load table data from cookies
function loadTableDataFromCookies(id) {
  filename=id;
  if(loggingCookies) console.log("Try loading cookie named "+filename)
  const savedData = getCookie(id);  // Get saved table data cookie
  if (savedData) {
      const tableData = JSON.parse(savedData);  // Parse the JSON string back into an object
      // Recreate the Tabulator table with the saved data
      if(loggingCookies) console.log("Table data loaded from cookies! Name is "+filename);
      return tableData;
  } else {
    if(loggingCookies) console.log("No table data found in cookies.");
  }
}