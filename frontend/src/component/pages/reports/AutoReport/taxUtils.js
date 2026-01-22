// taxUtils.js
const calculateYearlyTax = (profit) => {
    if (profit <= 7200) {
      return { tax: 0, percentage: 0, range: '0 - 7200' };
    } else if (profit <= 19800) {
      return { tax: (profit * 0.10) - 720, percentage: 10, range: '7201 - 19800' };
    } else if (profit <= 38400) {
      return { tax: (profit * 0.15) - 1710, percentage: 15, range: '19801 - 38400' };
    } else if (profit <= 63000) {
      return { tax: (profit * 0.20) - 3630, percentage: 20, range: '38401 - 63000' };
    } else if (profit <= 93600) {
      return { tax: (profit * 0.25) - 6780, percentage: 25, range: '63001 - 93600' };
    } else if (profit <= 130800) {
      return { tax: (profit * 0.30) - 11460, percentage: 30, range: '93601 - 130800' };
    } else {
      return { tax: (profit * 0.35) - 18000, percentage: 35, range: 'over 130801' };
    }
  };
  
  export default  calculateYearlyTax;
  