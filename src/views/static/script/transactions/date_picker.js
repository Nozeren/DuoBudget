// Date Picker
let lastDate, firstDate, currentDate;
const datePicker = document.getElementById("datePicker");
const dateRightButton = document.getElementById("date-pagination-right");
const dateLeftButton = document.getElementById("date-pagination-left");

function getDatePickerValue() {
  // Return [year, month]
  let value = datePicker.value;
  let [year, month] = value.split("-").map(Number);
  firstDay = new Date(year, month - 1, 1).toISOString().split("T")[0];
  lastDay = new Date(year, month, 0).toISOString().split("T")[0];
  return value.split("-").map(Number);
}
async function addDateToPicker(transactions) {
  const dateColumnName = "posted_date";
  // First date in transactions as reference
  if (transactions[0]) {
    lastDate = new Date(transactions[0][dateColumnName]);
    firstDate = new Date(transactions[0][dateColumnName]);
    // Get first and last date in transactions to fill Date picker/filter
    transactions.forEach((transaction) => {
      currentDate = new Date(transaction[dateColumnName]);
      if (lastDate < currentDate) {
        lastDate = currentDate;
      }
      if (firstDate > currentDate) {
        firstDate = currentDate;
      }
    });
    // Set Date Picker Max,Min & Default Value
    datePicker.setAttribute("value", lastDate.toISOString().slice(0, 7));
    datePicker.setAttribute("max", lastDate.toISOString().slice(0, 7));
    datePicker.setAttribute("min", firstDate.toISOString().slice(0, 7));
  } else {
    datePicker.setAttribute("value", new Date().toISOString().slice(0, 7));
  }
  updateDatePickerButtons();
}

function updateDatePickerButtons() {
  let [year, month] = getDatePickerValue();
  let lastDayOfMonth = new Date(year, month, 0).toISOString().split("T")[0];
  let firstDayOfMonth = new Date(year, month - 1, 1).toISOString().split("T")[0];
  if (lastDayOfMonth >= lastDate.toISOString().split("T")[0]) {
    dateRightButton.hidden = true;
  } else {
    dateRightButton.hidden = false;
  }
  if (firstDayOfMonth <= firstDate.toISOString().split("T")[0]) {
    dateLeftButton.hidden = true;
  } else {
    dateLeftButton.hidden = false;
  }
}

dateRightButton.addEventListener("click", () => {
  let [year, month] = getDatePickerValue();
  month++;
  if (month > 12) {
    month = 1;
    year++;
  }
  if (month < 10) {
    month = "0" + month;
  }
  datePicker.value = `${year}-${month}`;
  const event = new Event("change"); // Create a click event
  datePicker.dispatchEvent(event);
  updateDatePickerButtons();
});
dateLeftButton.addEventListener("click", () => {
  let [year, month] = getDatePickerValue();
  month--;
  if (month < 1) {
    month = 12;
    year--;
  }
  if (month < 10) {
    month = "0" + month;
  }
  datePicker.value = `${year}-${month}`;
  const event = new Event("change"); // Create a click event
  datePicker.dispatchEvent(event);
  updateDatePickerButtons();
});
datePicker.addEventListener("focus", function (event) {
  event.target.showPicker();
});
datePicker.addEventListener("change", async function (event) {
  transactions = await getTransactions();
  addTransactionsToTable(transactions);
  event.target.blur();
  updateDatePickerButtons();
});
