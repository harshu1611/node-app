const express = require('express');
const mysql = require('mysql');

const router = express.Router();

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

conn.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

router.get('/api/items', (req,res)=>{
    let sql = 'SELECT * FROM items';

    conn.query(sql, (err, data) => {
        if (err) {
            console.error('Error fetching items:', err);
            res.status(500).send('Error fetching items');
            return;
        }
        res.status(200).json({data:data})
    });
})

router.post('/api/item', (req, res) => {
    const {title,body} = req.body;
    
    let sql = `INSERT INTO items (title,body) VALUE ('${title}','${body}')`;

    conn.query(sql, (err, data) => {
        if (err) {
            console.error('Error inserting item:', err);
            res.status(500).send('Error inserting item');
            return;
        }
        res.status(201).json({message: 'Item created successfully', data: data});
    });
})

router.get('/api/item/:id', (req, res) => {
    const itemId = req.params.id;
    
    let sql = `SELECT * FROM items WHERE id = ${itemId}`;

    conn.query(sql, (err, data) => {
        if (err) {
            console.error('Error fetching item:', err);
            res.status(500).send('Error fetching item');
            return;
        }
        if (data.length === 0) {
            res.status(404).send('Item not found');
            return;
        }
        res.status(200).json({data: data[0]});
    });
})

router.put('/api/item/:id', (req, res) => {
    const itemId = req.params.id;
    const {title, body} = req.body;

    let sql = `UPDATE items SET title = '${title}', body = '${body}' WHERE id = ${itemId}`; 

    conn.query(sql, (err, data) => {
        if (err) {
            console.error('Error updating item:', err);
            res.status(500).send('Error updating item');
            return;
        }
        if (data.affectedRows === 0) {
            res.status(404).send('Item not found');
            return;
        }
        res.status(200).json({message: 'Item updated successfully'});
    }); 
})

router.delete('/api/item/:id', (req, res) => {
    const itemId = req.params.id;

    let sql = `DELETE FROM items WHERE id = ${itemId}`;

    conn.query(sql, (err, data) => {
        if (err) {
            console.error('Error deleting item:', err);
            res.status(500).send('Error deleting item');
            return;
        }
        if (data.affectedRows === 0) {
            res.status(404).send('Item not found');
            return;
        }
        res.status(200).json({message: 'Item deleted successfully'});
    });
});

module.exports = router;