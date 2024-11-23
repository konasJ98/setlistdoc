
// Function to save data as a JSON file
function saveDataAsJSON() {
    const tableData = table.getData();  // Get all the table data

    // Convert data to JSON
    const jsonData = JSON.stringify(tableData, null, 2);

    // Create a Blob object with the JSON data
    const blob = new Blob([jsonData], { type: "application/json" });

    // Create a link to trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tableData.json";  // The name of the file

    // Trigger the download
    link.click();
  }

  // Function to load data from a JSON file
  function loadDataFromJSON(file) {
    const reader = new FileReader();

    reader.onload = function(event) {
      const jsonData = event.target.result;
      const data = JSON.parse(jsonData); // Parse the JSON data

      // Load data into the table
      table.setData(data);
    };

    reader.readAsText(file); // Read the file as text
  }
