import * as cloneDeep from "lodash.clonedeep";

// CSV helper provides the download to CSV functionality for text and table annotations.

function downloadCSV(csv, filename) {
  var csvFile;
  var downloadLink;
  //define the file type to text/csv
  csvFile = new Blob([csv], { type: "text/csv" });
  downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";

  document.body.appendChild(downloadLink);
  downloadLink.click();
}

function convertJSONtoTable(tableData = []) {
  let columns = [];
  let rowsData = [];
  let currentRowIndex;
  tableData.map((rowData, index) => {
    currentRowIndex = rowData["row_index"];
    if (!currentRowIndex) {
      columns.push({
        field: `col_${rowData["column_index"]}`,
        sortable: false,
        editable: true,
        width: 200,
      });
      rowsData.push({
        [`col_${rowData["column_index"]}`]:
          rowData.word_details &&
          rowData.word_details
            .reduce((acc, current) => `${acc}${current.word_description} `, "")
            .trim(),
      });
    } else if (currentRowIndex === rowData["row_index"]) {
      rowsData[rowData["row_index"] - 1] =
        rowsData[rowData["row_index"] - 1] || {};
      if (rowData["row_index"] === 1) {
        columns.push({
          field: `col_${rowData["column_index"]}`,
          sortable: false,
          editable: true,
          width: 200,
        });
      }
      rowsData[rowData["row_index"] - 1][`col_${rowData["column_index"]}`] =
        rowData.word_details &&
        rowData.word_details
          .reduce((acc, current) => `${acc}${current.word_description} `, "")
          .trim();
    } else {
      rowsData[rowData["row_index"] - 1] =
        rowsData[rowData["row_index"] - 1] || {};
      rowsData[rowData["row_index"] - 1][`col_${rowData["column_index"]}`] =
        rowData.word_details &&
        rowData.word_details
          .reduce((acc, current) => `${acc}${current.word_description} `, "")
          .trim();
    }
    return rowData;
  });
  return {
    columns,
    rowsData,
  };
}
//user-defined function to export the data to CSV file format
export default function exportToCSV(
  filename,
  annotatedData,
  tableAnnotations,
  csvType,
  selectedTableIndex
) {
  if (tableAnnotations && csvType === "onlyTable") {
    tableAnnotations = cloneDeep(tableAnnotations).splice(
      selectedTableIndex,
      1
    );
  }
  var csv = [];
  // var rows = document.querySelectorAll("table tr");
  let textAnnotationHeader = "";
  let textAnnotationdata = "";
  if (csvType !== "onlyTable") {
    annotatedData["labels"].forEach((label) => {
      if (textAnnotationHeader !== "") {
        textAnnotationHeader += ",";
        textAnnotationdata += ",";
      }
      textAnnotationHeader += label["label_name"];
      textAnnotationdata += `"${label["label_value"].replace(/"/g, '""')}"`;
    });
    csv.push(textAnnotationHeader + "\n" + textAnnotationdata);
  }
  if (csvType !== "onlyText") {
    tableAnnotations?.length &&
      tableAnnotations.map((tableDetails, index) => {
        const { rowsData } = convertJSONtoTable(tableDetails.cell_details);
        let rowDataForCSV = ["", `Table Annotation - ${index + 1}:`];
        rowsData.map((row, index) => {
          rowDataForCSV.push(Object.values(row).join(","));
          return row;
        });
        csv.push(rowDataForCSV.join("\n"));
        return tableDetails;
      });
  }
  downloadCSV(csv.join("\n"), filename);
}
