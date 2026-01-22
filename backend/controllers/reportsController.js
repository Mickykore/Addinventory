const {Sale, Cumulativesales} = require('../models/salesModel');
const { Expense } = require('../models/expenseModel');

const getReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    console.log(req.body);

    // Fetch cumulative sales report data
    const reportData = await generateReport(startDate, endDate);
    const expenseData = await generateExpenseReport(startDate, endDate);

    // console.log("ok report", reportData);

    // Fetch most and least sold items arranged from most to least
    const { mostSoldItems, leastSoldItems } = await fetchMostAndLeastSoldItems(startDate, endDate);

    // Combine the report data with the most and least sold items
    const combinedReportData = {
      reportData,
      expenseData,
      mostSoldItems,
      leastSoldItems
    };

    res.status(200).json(combinedReportData);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const generateReport = async (startDate, endDate) => {
  // Convert the start and end dates to the beginning and end of the day
  const startOfDay = new Date(startDate);
  startOfDay.setHours(3, 0, 0, 0);
  const endOfDay = new Date(endDate);
  endOfDay.setHours(26, 59, 59, 999);

 console.log("ok report");


  const reportData = await Sale.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } })
                  .populate({
                    path: 'product', // Populate the 'product' field
                    select: 'name  category purchasedPrice', // Select the fields you want to populate
                    populate: {
                        path: 'category', // Populate the 'category' field within the 'product'
                        select: 'name' // Select the 'name' field of the 'category'
                    }
})// only return the 'name' field
    .populate('seller', 'firstname');

    const filteredreportData = reportData.filter(item => item.product && item.product.category && item.product.category.name);
    

  
  return filteredreportData;
}


  const generateExpenseReport = async (startDate, endDate) => {
    // Convert the start and end dates to the beginning and end of the day
    const startOfDay = new Date(startDate);
    startOfDay.setHours(6, 0, 0, 0);
    const endOfDay = new Date(endDate);
    endOfDay.setHours(26, 59, 59, 999);
  
    const reportData = await Expense.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } });
  
    return reportData;
  };



  const fetchMostAndLeastSoldItems = async (startDate, endDate) => {
    // Fetch the most sold items
    const mostSoldItems = await Cumulativesales.find({ createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } })
      .sort({ quantity: -1 })
      .limit(5); // You can adjust the limit as needed
    
    // Fetch the least sold items
    const leastSoldItems = await Cumulativesales.find({ createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } })
      .sort({ quantity: 1 })
      .limit(5); // You can adjust the limit as needed
  
    return { mostSoldItems, leastSoldItems };
  };

module.exports = { getReports };
