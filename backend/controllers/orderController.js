const Order = require('../models/orderModel');
const asyncHandler = require('express-async-handler');
const { upload, fileSizeFormatter } = require('../utils/fileUpload');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const capitalizeAndClean = require('../utils/stringUtils');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createOrder = async (req, res) => {
  try {
    let {name, category, quantity, orderer, phoneNumber, description, image} = req.body;

    name = capitalizeAndClean(name);
    orderer = capitalizeAndClean(orderer);
    category = capitalizeAndClean(category);


    const userId = req.user._id;
    //vallidate data
    console.log("ok order");

    if (!name || !category || !orderer || !phoneNumber || !quantity) {
        res.status(400).json({message: 'Please fill all fields'});
        return;
    }
    
    // Handle Image upload
  let fileData = {};
  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Pinvent App",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

    
    //create order
    const order = await Order.create({
        name,
        category,
        quantity,
        orderBy: {
            name:orderer,
            phoneNumber
        },
        description,
        image: fileData,
    });
    res.json(order);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({});
    console.log("ok order");
    // Format createdAt to date only
    const formattedOrders = orders.map(order => ({
        ...order.toObject(),
        createdAt: new Date(order.createdAt).toISOString().slice(0, 10)
    }));

    res.json(formattedOrders);
});

const getOrderById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid Order ID');
    }
    console.log("ok order");
    const order = await Order.findById(req.params.id);
        

    if (order) {
        // Format createdAt to date only
        const formattedOrder = {
            ...order.toObject(),
            createdAt: new Date(order.createdAt).toISOString().slice(0, 10)
        };
        res.json(formattedOrder);
        // res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});
const deleteOrder = asyncHandler(async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid product ID');
    }
    const order = await Order.findById(req.params.id);      

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }
    await order.deleteOne();
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

const updateOrder = asyncHandler(async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid product ID');
    }

    let {name, category, quantity, orderer, phoneNumber, description, image} = req.body;

    name = capitalizeAndClean(name);
    orderer = capitalizeAndClean(orderer);
    category = capitalizeAndClean(category);
    
    const order = await Order.findById(req.params.id); 
    //vallidate data
    if (!order) {
        res.status(400);
        throw new Error('Order not found');
    }     

     // Handle Image upload
  let fileData = {};
  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Pinvent App",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }
  
  console.log(req.body);
  //update product
    const updatedOrder = await Order.findByIdAndUpdate({_id: req.params.id}, {
        name,
        category,
        quantity,
        orderBy: {
            name: orderer,
            phoneNumber
        },
        description,
        // image: Object.keys(fileData).length === 0 ? product?.image : fileData,
    }, {new: true, upsert: true, setDefaultsOnInsert: true});   
    console.log("cccc", updatedOrder);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
};
