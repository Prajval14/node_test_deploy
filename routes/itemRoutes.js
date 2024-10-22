const express = require('express');
const router = express.Router();
const Item = require('../models/item');

// CREATE: Add a new item
router.post('/add', async (req, res) => {
    const { name, description } = req.body;
    const newItem = new Item({ name, description });
    await newItem.save();
    res.redirect('/');
});

// READ: Get all items
router.get('/', async (req, res) => {
    const items = await Item.find();
    let html = '<h1>Item List</h1><ul>';
    items.forEach(item => {
        html += `<li>${item.name} - ${item.description} 
                 <a href="/items/edit/${item._id}">Edit</a> 
                 <a href="/items/delete/${item._id}">Delete</a></li>`;
    });
    html += '</ul><br><a href="/">Back to Home</a>';
    res.send(html);
});

// UPDATE: Edit an item
router.get('/edit/:id', async (req, res) => {
    const item = await Item.findById(req.params.id);
    res.send(`
        <h1>Edit Item</h1>
        <form action="/items/update/${item._id}" method="POST">
            <input type="text" name="name" value="${item.name}" required />
            <input type="text" name="description" value="${item.description}" required />
            <button type="submit">Update</button>
        </form>
    `);
});

router.post('/update/:id', async (req, res) => {
    const { name, description } = req.body;
    await Item.findByIdAndUpdate(req.params.id, { name, description });
    res.redirect('/items');
});

// DELETE: Delete an item
router.get('/delete/:id', async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.redirect('/items');
});

module.exports = router;
