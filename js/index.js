const cancelFindButton = document.getElementById("cancel_find_button");
const findInput = document.getElementById("find_input");

let smartphones = [];

class Smartphone {
    constructor(brand, model, price, color, image) {
        this.brand = brand;
        this.model = model;
        this.price = price;
        this.color = color;
        this.image = image;
    }
}

const smartphonesData = [
    new Smartphone('Samsung', 'Galaxy S21', 800, 'Black', './src/images/samsung.jpg'),
    new Smartphone('Apple', 'iPhone 13', 1000, 'Silver', './src/images/iphone.jpg'),
    new Smartphone('Google', 'Pixel 6', 750, 'White', './src/images/google.webp'),
    new Smartphone('Xiaomi', 'Redmi 8A', 900, 'Red', './src/images/xiaomi.jpg'),
    new Smartphone('Honor', 'Magic', 500, 'Green', './src/images/honor.jpg'),
    new Smartphone('Poco', 'X3', 200, 'Blue', './src/images/poco.jpg'),
    new Smartphone('Huawei', 'Nova 10', 700, 'Black', './src/images/huawei.jpg')
];

let filteredSmartphones = smartphonesData;

function renderSmartphones(smartphones) {
    const phonesList = document.getElementById('phones-list');
    phonesList.innerHTML = '';

    smartphones.forEach(phone => {
        const phoneItem = document.createElement('div');
        phoneItem.classList.add('phone-item');
        phoneItem.innerHTML = `
            <img src="${phone.image}" alt="${phone.brand} ${phone.model}" width="200">
            <p>Бренд: ${phone.brand}</p>
            <p>Модель: ${phone.model}</p>
            <p>Ціна: $${phone.price}</p>
        `;
        phonesList.appendChild(phoneItem);
    });
    filteredSmartphones = smartphones;
}

renderSmartphones(filteredSmartphones);

const cancelSearchButton = document.getElementById("cancel-search-button");

cancelSearchButton.addEventListener("click", () => {
    renderSmartphones(smartphonesData);
    calculateTotalPrice();
    document.getElementById('search-input').value = "";
});

document.getElementById('sort-by-price').addEventListener('click', () => {
    const sortedPhones = [...filteredSmartphones].sort((a, b) => a.price - b.price);
    renderSmartphones(sortedPhones);
});

document.getElementById('sort-by-brand').addEventListener('click', () => {
    const sortedPhones = [...filteredSmartphones].sort((a, b) => a.brand.localeCompare(b.brand));
    renderSmartphones(sortedPhones);
});

document.getElementById('search-button').addEventListener('click', () => {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredPhones = filteredSmartphones.filter(phone =>
        phone.brand.toLowerCase().includes(searchTerm) ||
        phone.model.toLowerCase().includes(searchTerm)
    );
    renderSmartphones(filteredPhones);

    calculateTotalPrice();
});

function calculateTotalPrice() {
    const totalAmount = filteredSmartphones.reduce((total, phone) => total + phone.price, 0);
    document.getElementById('total-amount').textContent = totalAmount;
}

calculateTotalPrice();
