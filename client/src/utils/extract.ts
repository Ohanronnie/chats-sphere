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
export default extract;
