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

    smartphones.forEach((phone, index) => {
        const phoneItem = document.createElement('div');
        phoneItem.classList.add('phone-item');
        phoneItem.innerHTML = `
            <img src="${phone.image}" alt="${phone.brand} ${phone.model}" width="200">
            <p>Бренд: ${phone.brand}</p>
            <p>Модель: ${phone.model}</p>
            <p>Ціна: $${phone.price}</p>
            <button class="edit-button" data-index="${index}">Редагувати</button>
        `;
        phonesList.appendChild(phoneItem);
    });

    phonesList.querySelectorAll('.edit-button').forEach((editButton) => {
        editButton.addEventListener('click', () => {
            const index = editButton.getAttribute('data-index');
            openEditModal(smartphones[index]);
        });
    });
}

function openEditModal(phone) {
    const editForm = document.getElementById('edit-form');
    editForm.style.display = 'block';

    document.getElementById('edit-brand').value = phone.brand;
    document.getElementById('edit-model').value = phone.model;
    document.getElementById('edit-price').value = phone.price;
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

const createButton = document.getElementById("create-button");
const createForm = document.getElementById("create-form");

createButton.addEventListener("click", () => {
    createForm.style.display = "block";
});

const cancelCreateButton = document.getElementById("cancel-create-button");

cancelCreateButton.addEventListener("click", () => {
    createForm.style.display = "none";
});

createForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const brand = document.getElementById("brand").value;
    const model = document.getElementById("model").value;
    const price = parseFloat(document.getElementById("price").value);

    const newSmartphone = new Smartphone(brand, model, price);

    smartphonesData.push(newSmartphone);

    createForm.reset();

    createForm.style.display = "none";

    renderSmartphones(smartphonesData);
    calculateTotalPrice();
});

const editForm = document.getElementById("edit-form");
const editButton = document.getElementById("edit-button");
const cancelButton = document.getElementById("cancel-button");

document.getElementById('edit-button').addEventListener('click', () => {
    const phonesList = document.getElementById('phones-list');
    phonesList.innerHTML = '';

    smartphonesData.forEach((phone, index) => {
        const phoneItem = document.createElement('div');
        phoneItem.classList.add('phone-item');
        phoneItem.innerHTML = `
            <img src="${phone.image}" alt="${phone.brand} ${phone.model}" width="200">
            <p>Бренд: ${phone.brand}</p>
            <p>Модель: ${phone.model}</p>
            <p>Ціна: $${phone.price}</p>
            <button class="edit-button" data-index="${index}">Редагувати</button>
        `;
        phonesList.appendChild(phoneItem);
    });

    phonesList.querySelectorAll('.edit-button').forEach((editButton) => {
        editButton.addEventListener('click', () => {
            const index = editButton.getAttribute('data-index');
        });
    });
});

createButton.addEventListener("click", () => {
    createForm.style.display = "block";
    editForm.style.display = "none";
});

createForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const brand = document.getElementById("brand").value;
    const model = document.getElementById("model").value;
    const price = parseFloat(document.getElementById("price").value);
    const color = document.getElementById("color").value;
    const image = document.getElementById("image").value;

    const newSmartphone = new Smartphone(brand, model, price, color, image);

    smartphonesData.push(newSmartphone);

    createForm.reset();

    renderSmartphones(filteredSmartphones);
    calculateTotalPrice();
});

editButton.addEventListener("click", () => {
    createForm.style.display = "none";
    editForm.style.display = "block";
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();
});

cancelButton.addEventListener("click", () => {
    createForm.style.display = "none";
    editForm.style.display = "none";
});
