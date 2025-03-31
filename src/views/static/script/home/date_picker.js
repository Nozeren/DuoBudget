// Date Picker
let lastDate, firstDate, currentDate;
const datePicker = document.getElementById("datePicker");
const dateRightButton = document.getElementById("date-pagination-right");
const dateLeftButton = document.getElementById("date-pagination-left");

function getDatePickerValue() {
  // Return [year, month]
  let value = datePicker.value;
  if (value) {
    let [year, month] = value.split("-").map(Number);
    firstDay = new Date(year, month - 1, 1).toISOString().split("T")[0];
    lastDay = new Date(year, month, 0).toISOString().split("T")[0];
    return value.split("-").map(Number);
  }
  return value;
}
function datePickerButtons() {
  let value = datePicker.value;
  let max = datePicker.max;
  let min = datePicker.min;
  if (value === max) {
    dateRightButton.style.display = "none";
  } else {
    dateRightButton.style.display = "flex";
  }
  if (value === min) {
    dateLeftButton.style.display = "none";
  } else {
    dateLeftButton.style.display = "flex";
  }
}
function getDefaultDate() {}
async function addPickerDefaultValues() {
  let pickerValue = getDatePickerValue();
  // Add Current Month/Year incase Picker is empty
  if (!pickerValue) {
    let currentDate = new Date();
    let nextMonth = new Date(new Date(currentDate).setMonth(currentDate.getMonth() + 1)).toISOString();
    currentDate = currentDate.toISOString();
    datePicker.setAttribute("value", currentDate.slice(0, 7));
    datePicker.setAttribute("max", nextMonth.slice(0, 7));
    datePicker.setAttribute("min", currentDate.slice(0, 7));
  }
  let dates = await getDates();
  if (dates) {
    let maxDate = new Date(dates["max"]["year"], dates["max"]["month"], 1);
    maxDate = new Date(new Date(maxDate).setMonth(maxDate.getMonth() + 1)).toISOString();
    if (maxDate > datePicker.max) {
      datePicker.setAttribute("max", maxDate.slice(0, 7));
    }
    let minDate = new Date(dates["min"]["year"], dates["min"]["month"], 1);
    minDate = new Date(new Date(minDate).setMonth(minDate.getMonth())).toISOString();
    if (minDate < datePicker.min) {
      datePicker.setAttribute("min", minDate.slice(0, 7));
    }
  }
}

window.onload = async () => {
  await addPickerDefaultValues();
  datePickerButtons();
};

datePicker.addEventListener("focus", function (event) {
  event.target.showPicker();
});

datePicker.addEventListener("change", async function (event) {
  event.target.blur();
  datePickerButtons();
});

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
  datePickerButtons();
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
  datePickerButtons();
});
