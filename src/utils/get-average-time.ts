const getAverageTime = (
  totalHour: number, 
  totalMinute: number,
  recordLength: number) => {
  let averageHour: number;
  let averageMinute: number;

  while((totalHour % recordLength) !== 0) {
    totalHour += 1;
    totalMinute -= 60;
  }

  averageHour = (totalHour / recordLength) - 1;
  averageMinute = (totalMinute / recordLength) + 60;

  if(averageMinute >= 60) {
    averageHour += Math.floor(averageMinute / 60);
    averageMinute = averageMinute % 60;
  }

  return `${averageHour < 10 ? '0' + averageHour : averageHour }:${averageMinute < 10 ? '0' + Math.ceil(averageMinute)
    : Math.ceil(averageMinute)}`;
}

export default getAverageTime;