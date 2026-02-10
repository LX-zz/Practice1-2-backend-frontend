const express = require('express');
const app = express();
const port = 3000;

// Middleware для парсинга JSON
app.use(express.json());

// CORS для доступа из браузера
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Начальные данные товаров
let products = [
    { 
        id: 1, 
        name: 'Ноутбук игровой', 
        price: 75000,
        description: 'Мощный игровой ноутбук с RTX 4060',
        image: 'https://via.placeholder.com/300x200/3498db/ffffff?text=Ноутбук'
    },
    { 
        id: 2, 
        name: 'Смартфон', 
        price: 35000,
        description: 'Флагманский смартфон с камерой 108 Мп',
        image: 'https://via.placeholder.com/300x200/2ecc71/ffffff?text=Смартфон'
    },
    { 
        id: 3, 
        name: 'Наушники', 
        price: 8000,
        description: 'Беспроводные наушники с шумоподавлением',
        image: 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Наушники'
    }
];

// Главная страница API
app.get('/', (req, res) => {
    res.json({
        message: 'API управления товарами (Практика №2)',
        endpoints: {
            getAllProducts: 'GET /api/products',
            getProductById: 'GET /api/products/:id',
            createProduct: 'POST /api/products',
            updateProduct: 'PUT /api/products/:id',
            deleteProduct: 'DELETE /api/products/:id'
        }
    });
});

// 1. Получить все товары
app.get('/api/products', (req, res) => {
    res.json(products);
});

// 2. Получить товар по ID
app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    res.json(product);
});

// 3. Создать новый товар
app.post('/api/products', (req, res) => {
    const { name, price, description, image } = req.body;
    
    if (!name || !price) {
        return res.status(400).json({ error: 'Нужны название и цена' });
    }
    
    const newId = products.length > 0 
        ? Math.max(...products.map(p => p.id)) + 1 
        : 1;
    
    const newProduct = {
        id: newId,
        name,
        price: Number(price),
        description: description || 'Описание отсутствует',
        image: image || 'https://via.placeholder.com/300x200/95a5a6/ffffff?text=Товар'
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// 4. Обновить товар
app.put('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    const { name, price, description, image } = req.body;
    
    if (name) product.name = name;
    if (price) product.price = Number(price);
    if (description) product.description = description;
    if (image) product.image = image;
    
    res.json(product);
});

// 5. Удалить товар
app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = products.length;
    
    products = products.filter(p => p.id !== id);
    
    if (products.length === initialLength) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    res.json({ message: `Товар с ID ${id} удален` });
});

// Запуск сервера
app.listen(port, () => {
    console.log('=========================================');
    console.log('Практика №2: Сервер запущен');
    console.log(`Адрес: http://localhost:${port}`);
    console.log('=========================================');
});