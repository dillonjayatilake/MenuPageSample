const MenuItem = require('../models/MenuItem');


const getMenuItems = async () => {
    return await MenuItem.find({ restaurantID: "res1" });
};

const addMenuItem = async (data) => {
    const item = new MenuItem(data);
    return await item.save();
};

const deleteMenuItem = async (id) => {
    return await MenuItem.findByIdAndDelete(id);
};

const updateMenuItem = async (id, data) => {
    return await MenuItem.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
};

module.exports = {
    getMenuItems,
    addMenuItem,
    deleteMenuItem,
    updateMenuItem,
};
