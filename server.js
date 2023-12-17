const cors = require('cors');
const { Client } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const client = new Client({
    user: 'apple',
    host: 'localhost',
    database: 'postgres',
    password: '12345',
    port: 5432,
})

client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err));

app.use(cors());
app.use(bodyParser.json());

app.get('/api/smartphones', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM smartphones');
    //    console.log('result.rows: ', result.rows); 
        res.send({data: result.rows});
        
    } catch (error) {
        console.error('Error fetching smartphones', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/smartphones/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const smartphone = await client.query(`SELECT * FROM smartphones WHERE id = ${id}`);
        res.send(smartphone);
    } catch (error) {
        console.error('Error fetching smartphones', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/smartphones', async (req, res) => {
    const newSmartphone = req.body;
    try {
        const { brand, model, price, image } = newSmartphone;
        const result = await client.query('INSERT INTO smartphones (brand, model, price, image) VALUES ($1, $2, $3, $4) RETURNING *', [brand, model, price, image]);
        res.status(201).send(result);

    } catch (error) {
        console.error('Error inserting smartphone:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.put('/api/smartphones/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    console.log('id: ', id);
    // const smartphone = (await client.query(`SELECT * FROM smartphones WHERE id = ${id}`)).rows[0];

    const updatedSmartphone = req.body;

    const { brand, model, price, image} = updatedSmartphone;
    // brand && (smartphone.brand = brand);
    // model && (smartphone.model = model);
    // price && (smartphone.price = price);
    // image && (smartphone.image = image);

    const updateQuery = `
        UPDATE smartphones 
        SET image = '${image}', brand = '${brand}', model = '${model}', price = '${price}' 
        WHERE id = ${id}
    `;

    try {
        await client.query(updateQuery);

        const updatedData = await client.query(`SELECT * FROM smartphones WHERE id = ${id}`);

        res.send(updatedData.rows);
    } catch (error) {
        console.error('Error updating smartphone:', error);
        res.status(500).send('Error updating smartphone');
    }
});


app.delete('/api/smartphones/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const smartphone = (await client.query(`DELETE FROM smartphones WHERE id = ${id}`));
    res.send(smartphone);
});

app.listen(port, () => {
    console.log(`Сервер запущений на порту ${port}`);
});
