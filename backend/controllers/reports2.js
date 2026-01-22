const Sale = require('../models/Sale');

// Function to generate daily report
const generateDailyReport = async (date) => {
    try {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        const sales = await Sale.find({
            createdAt: { $gte: startDate, $lt: endDate }
        });

        const totalRevenue = sales.reduce((total, sale) => total + sale.revenue, 0);
        const totalProfit = sales.reduce((total, sale) => total + sale.profit, 0);

        return {
            sales,
            totalRevenue,
            totalProfit
        };
    } catch (error) {
        throw new Error('Failed to generate daily report');
    }
};

// Function to generate weekly report
const generateWeeklyReport = async (date) => {
    try {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 7);

        const sales = await Sale.find({
            createdAt: { $gte: startDate, $lt: endDate }
        });

        const totalRevenue = sales.reduce((total, sale) => total + sale.revenue, 0);
        const totalProfit = sales.reduce((total, sale) => total + sale.profit, 0);

        return {
            sales,
            totalRevenue,
            totalProfit
        };
    } catch (error) {
        throw new Error('Failed to generate weekly report');
    }
};

// Function to generate monthly report
const generateMonthlyReport = async (date) => {
    try {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setMonth(endDate.getMonth() + 1);

        const sales = await Sale.find({
            createdAt: { $gte: startDate, $lt: endDate }
        });

        const totalRevenue = sales.reduce((total, sale) => total + sale.revenue, 0);
        const totalProfit = sales.reduce((total, sale) => total + sale.profit, 0);

        return {
            sales,
            totalRevenue,
            totalProfit
        };
    } catch (error) {
        throw new Error('Failed to generate monthly report');
    }
};

// Function to generate yearly report
const generateYearlyReport = async (date) => {
    try {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setFullYear(endDate.getFullYear() + 1);

        const sales = await Sale.find({
            createdAt: { $gte: startDate, $lt: endDate }
        });

        const totalRevenue = sales.reduce((total, sale) => total + sale.revenue, 0);
        const totalProfit = sales.reduce((total, sale) => total + sale.profit, 0);

        return {
            sales,
            totalRevenue,
            totalProfit
        };
    } catch (error) {
        throw new Error('Failed to generate yearly report');
    }
};

module.exports = {
    generateDailyReport,
    generateWeeklyReport,
    generateMonthlyReport,
    generateYearlyReport
};