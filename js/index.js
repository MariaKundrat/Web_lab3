import { initializeServerWithData, postPhone } from "./api.js";

const cancelFindButton = document.getElementById("cancel_find_button");
const findInput = document.getElementById("find_input");

let smartphones = [];

class Smartphone {
    constructor(phoneData) {
        this.brand = phoneData.brand;
        this.model = phoneData.model;
        this.price = phoneData.price;
        this.image = phoneData.image;
    }
}
const response = await initializeServerWithData();
console.log('smartphonesData: ', response);

function renderApiResponse(smartphones) {
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
}

renderApiResponse(response.data);

const cancelSearchButton = document.getElementById("cancel-search-button");

cancelSearchButton.addEventListener("click", () => {
    renderSmartphones(response.data);
    calculateTotalPrice();
    document.getElementById('search-input').value = "";
});

document.getElementById('sort-by-price').addEventListener('click', () => {
    const sortedPhones = [...response.data].sort((a, b) => a.price - b.price);
    renderSmartphones(sortedPhones);
});

document.getElementById('sort-by-brand').addEventListener('click', () => {
    const sortedPhones = [...response.data].sort((a, b) => a.brand.localeCompare(b.brand));
    renderSmartphones(sortedPhones);
});

document.getElementById('search-button').addEventListener('click', () => {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredPhones = response.data.filter(phone =>
        phone.brand.toLowerCase().includes(searchTerm) ||
        phone.model.toLowerCase().includes(searchTerm)
    );
    renderSmartphones(filteredPhones);

    calculateTotalPrice();
});

function calculateTotalPrice() {
    const totalAmount = response.data.reduce((total, phone) => total + +phone.price, 0);
    document.getElementById('total-amount').textContent = totalAmount;
}

calculateTotalPrice();

function openCreateModal() {
    const createModal = document.getElementById("create-modal");
    createModal.style.display = "block";
}

document.getElementById("open-create-modal-button").addEventListener("click", openCreateModal);
document.getElementById("create-button").addEventListener("click", createSmartphone);

async function createSmartphone() {
    const createForm = document.getElementById("create-modal-form");
    const formData = new FormData(createForm);

    const phoneData = {};
    const entries = formData.entries();

    for (const pair of entries) {
        const [name, value] = pair;
        phoneData[name] = value;
    }

    const brand = formData.get("brand").trim();
    const model = formData.get("model").trim();
    const price = formData.get("price").trim();
    const image = formData.get("image").trim();

    if (!brand || !model || !price || !image) {
        alert("Заповніть всі поля форми.");
        return;
    }

    if (price <= 0) {
        alert("Неправильна ціна, введіть правильне число.");
        return;
    }

    postPhone(phoneData);
    console.log("response log", response);

    document.getElementById("brand").value = "";
    document.getElementById("model").value = "";
    document.getElementById("price").value = "";
    document.getElementById("image").value = "";

    closeModalCreate();
    const response = await initializeServerWithData();
    renderApiResponse(response);

    calculateTotalPrice();
}

document.getElementById("close-create-modal").addEventListener("click", () => {
    closeModalCreate("create-modal");
});

function closeModalCreate() {
    const createModal = document.getElementById("create-modal");
    createModal.style.display = "none";
}

let isEditingMode = false;

document.getElementById('open-edit-modal-button').addEventListener('click', () => {
    isEditingMode = !isEditingMode;
    const editButtons = document.querySelectorAll('.edit-button');
    const deleteButtons = document.querySelectorAll('.delete-button');

    if (isEditingMode) {
        editButtons.forEach(button => {
            button.classList.add('show-buttons');
            button.classList.remove('hide-buttons');
        });
        deleteButtons.forEach(button => {
            button.classList.add('show-buttons');
            button.classList.remove('hide-buttons');
        });
    } else {
        editButtons.forEach(button => {
            button.classList.remove('show-buttons');
            button.classList.add('hide-buttons');
        });
        deleteButtons.forEach(button => {
            button.classList.remove('show-buttons');
            button.classList.add('hide-buttons');
        });
    }
});

async function openEditModal(smartphone) {
    const editModal = document.getElementById('edit-modal');
    const editBrandInput = document.getElementById('edit-brand');
    const editModelInput = document.getElementById('edit-model');
    const editPriceInput = document.getElementById('edit-price');
    const editImageInput = document.getElementById('edit-image');
    const saveEditButton = document.getElementById('save-edit-button');

    editBrandInput.value = smartphone.brand;
    editModelInput.value = smartphone.model;
    editPriceInput.value = smartphone.price;
    editImageInput.value = smartphone.image;

    editModal.style.display = 'block';

    saveEditButton.addEventListener('click', async () => {
        const smartphoneUpdate = {
            brand: editBrandInput.value,
            model: editModelInput.value,
            price: parseFloat(editPriceInput.value),
            image: editImageInput.value
        }

        updatePhone(smartphone.id, smartphoneUpdate);
        const response = await initializeServerWithData();
        renderApiResponse(response);
        calculateTotalPrice();

        editModal.style.display = 'none';
    });
}

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
            <button class="delete-button" data-index="${index}">Видалити</button>
        `;
        phonesList.appendChild(phoneItem);

        const deleteButton = phoneItem.querySelector('.delete-button');
        deleteButton.addEventListener("click", () => {
            openConfirmDeleteModal(smartphones[index]);
        });

        const editButton = phoneItem.querySelector('.edit-button');
        editButton.addEventListener('click', () => {
            openEditModal(smartphones[index]);
        });
    });

    closeModalEdit();
}

document.getElementById("close-edit-modal").addEventListener("click", () => {
    closeModal("edit-modal");
});

function closeModalEdit() {
    const editModalEdit = document.getElementById("edit-modal");
    editModalEdit.style.display = "none";
}

async function deleteSmartphone(smartphone) {
    deletePhone(smartphone.id);
    const response = await initializeServerWithData();
    renderApiResponse(response);
    calculateTotalPrice();
}

function openConfirmDeleteModal(smartphone) {
    const confirmDeleteModal = document.getElementById('confirm-delete-modal');
    const confirmDeleteMessage = document.getElementById('confirm-delete-message');
    const confirmDeleteButton = document.getElementById('confirm-delete-button');
    const cancelDeleteButton = document.getElementById('cancel-delete-button');

    confirmDeleteMessage.textContent = `Ви впевнені, що хочете остаточно видалити смартфон ${smartphone.brand} ${smartphone.model}?`;

    confirmDeleteModal.style.display = 'block';

    confirmDeleteButton.addEventListener('click', async () => {
        deletePhone(smartphone);
        const response = await initializeServerWithData();
        renderApiResponse(response);
        confirmDeleteModal.style.display = 'none';
    });

    cancelDeleteButton.addEventListener('click', () => {
        confirmDeleteModal.style.display = 'none';
    });
}

document.getElementById("close-confirm-delete-modal").addEventListener("click", () => {
    closeModal("confirm-delete-modal");
});

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

async function getAllPhones() {
    try {
        const response = await fetch('http://localhost:3000/api/smartphones');
        const phones = await response.json();
        return phones;
    } catch (error) {
        console.error('Error fetching phones', error);
        return [];
    }
}

async function addPhone(newPhoneData) {
    try {
        const response = await fetch('http://localhost:3000/api/smartphones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPhoneData),
        });
        const addedPhone = await response.json();
        return addedPhone;
    } catch (error) {
        console.error('Error adding phone', error);
        return null;
    }
}

async function updatePhone(phoneId, updatedPhoneData) {
    try {
        const response = await fetch(`http://localhost:3000/api/smartphones/${phoneId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPhoneData),
        });
        const updatedPhone = await response.json();
        return updatedPhone;
    } catch (error) {
        console.error('Error updating phone', error);
        return null;
    }
}

async function deletePhone(phoneId) {
    try {
        const response = await fetch(`http://localhost:3000/api/smartphones/${phoneId}`, {
            method: 'DELETE',
        });
        const deletedPhone = await response.json();
        return deletedPhone;
    } catch (error) {
        console.error('Error deleting phone', error);
        return null;
    }
}