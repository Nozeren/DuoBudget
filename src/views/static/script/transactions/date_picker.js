// Date Picker
let lastDate, firstDate, currentDate;
const datePicker = document.getElementById("datePicker");
const dateRightButton = document.getElementById("date-pagination-right");
const dateLeftButton = document.getElementById("date-pagination-left");

async function getDatePickerValue() {
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
async function addAvailableDates() {
  subcategories = await getSubcategories();
  let user_id = user_select.value;
  let dates = await getDates(user_id);
  if (dates) {
    let maxDate = new Date(dates["max"]["year"], dates["max"]["month"], 1);
    maxDate = new Date(new Date(maxDate).setMonth(maxDate.getMonth())).toISOString();
    //if (maxDate > datePicker.max) {
    datePicker.setAttribute("max", maxDate.slice(0, 7));
    datePicker.setAttribute("value", maxDate.slice(0, 7));
    //}
    let minDate = new Date(dates["min"]["year"], dates["min"]["month"], 1);
    minDate = new Date(new Date(minDate).setMonth(minDate.getMonth())).toISOString();
    datePicker.setAttribute("min", minDate.slice(0, 7));
  }
}
async function addPickerDefaultValues() {
  let pickerValue = await getDatePickerValue();
  // Add Current Month/Year incase Picker is empty
  if (!pickerValue) {
    let currentDate = new Date();
    currentDate = currentDate.toISOString();
    datePicker.setAttribute("value", currentDate.slice(0, 7));
    datePicker.setAttribute("max", currentDate.slice(0, 7));
    datePicker.setAttribute("min", currentDate.slice(0, 7));
  }
}

datePicker.addEventListener("focus", function (event) {
    console.log('hey')
  event.target.showPicker();
});

datePicker.addEventListener("change", async function (event) {
  event.target.blur();
  datePickerButtons();
  await addRows();
});

dateRightButton.addEventListener("click", async () => {
  let [year, month] = await getDatePickerValue();
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
  datePickerButtons();
});
dateLeftButton.addEventListener("click", async () => {
  let [year, month] = await getDatePickerValue();
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
  datePickerButtons();
});

async function setupDatePicker() {
  addPickerDefaultValues();
  await addAvailableDates();
  datePickerButtons();
}
