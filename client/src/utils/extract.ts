function extract(_data: any) {
  let groups = {};
  let data = structuredClone(_data);
  data.forEach(function (val: any) {
    var date = val.createdAt.split("T")[0];
    if (date in groups) {
      groups[date].push(val);
    } else {
      //groups[date] = new Array(val.sport);
      groups[date] = new Array(val);
    }
  });

  return groups;
}
const dayOfWeekMap = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

function getDateFunction(value: string): string {
  let currentDate = new Date();
  let arr = [];
  let thisDate = new Date(value);
  let _thisDate = new Date(value);
  if (thisDate.toLocaleDateString() === currentDate.toLocaleDateString())
    return "Today";
  else if (
    new Date(_thisDate.setDate(thisDate.getDate() + 1)).toLocaleDateString() ===
    currentDate.toLocaleDateString()
  ) {
    return "Yesterday";
  } else if (
    thisDate >
    new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 7
    )
  ) {
    return dayOfWeekMap[thisDate.getDay()];
  } else
    return thisDate.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
}
export default extract;
export { getDateFunction };
