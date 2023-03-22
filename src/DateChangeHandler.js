const DateChangeHandler = (date) => {
    console.log("date - ",date)
    // convert the selected date to YYYY-MM-DD format
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;
    console.log("formattedDate - ",formattedDate)
    return formattedDate
  };

export default DateChangeHandler;