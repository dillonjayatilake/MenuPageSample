const menuService = require('../services/menuService');

const getMenuItems = async (req, res) => {
    try {
        const menu = await menuService.getMenuItems();
        res.json(menu);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
};

const addMenuItem = async (req, res) => {
    try {
        const newItem = await menuService.addMenuItem(req.body);
        res.json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        const deleted = await menuService.deleteMenuItem(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateMenuItem = async (req, res) => {
    try {
        const updated = await menuService.updateMenuItem(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getMenuItems,
    addMenuItem,
    deleteMenuItem,
    updateMenuItem,
};
