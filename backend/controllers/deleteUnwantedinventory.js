const mongoose = require("mongoose");
const { Sale, Cumulativesales } = require("../models/salesModel");
const { Category, Product, CumulativeProducts } = require("../models/productsModel");

// MongoDB Connection String (Replace with yours)
const MONGO_URI = "mongodb+srv://mikiyasayele6:xYXzsoLd9AiflC06@ydinventory.5f5hvr1.mongodb.net/ydinventory?retryWrites=true&w=majority&appName=YDinventory";

const deleteCategoryData = async () => {
  try {
    // Step 1: Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const categoryIds = ["661a88678bdf3e198a6a09b8", "661d18cf94f46126fba897e0"];

    // Step 2: Find Cumulative Products
    const cumulativeProducts = await CumulativeProducts.find({ category: { $in: categoryIds } });

    if (cumulativeProducts.length === 0) {
      console.log("⚠️ No Cumulative Products found for the given categories.", cumulativeProducts.length);
    } else {
      console.log(`✅ Found ${cumulativeProducts.length} Cumulative Products`);
      const cumulativeProductIds = cumulativeProducts.map(prod => prod._id);

      // Step 3: Find Cumulative Sales related to these products
      const cumulativeSales = await Cumulativesales.find({ product: { $in: cumulativeProductIds } });

      if (cumulativeSales.length === 0) {
        console.log("⚠️ No Cumulative Sales found for the products being deleted.", cumulativeSales.length);
      } else {
        console.log(`✅ Found ${cumulativeSales.length} Cumulative Sales`);
      }

      // // Step 4: Delete Cumulative Products
      // const deletedCumulativeProducts = await CumulativeProducts.deleteMany({ category: { $in: categoryIds } });
      // console.log(`✅ Deleted ${deletedCumulativeProducts.deletedCount} Cumulative Products`);

      // // Step 5: Delete Cumulative Sales if they exist
      // if (cumulativeProductIds.length > 0) {
      //   const deletedCumulativeSales = await Cumulativesales.deleteMany({ product: { $in: cumulativeProductIds } });
      //   console.log(`✅ Deleted ${deletedCumulativeSales.deletedCount} Cumulative Sales`);
      // }
    }

    // Step 6: Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("✅ Deletion process completed successfully.");
  } catch (error) {
    console.error("❌ Error during deletion process:", error);
    await mongoose.disconnect();
  }
};

deleteCategoryData();
