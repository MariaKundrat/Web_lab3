import {getAllsmartphones, postsmartphone, updatesmartphone } from "./api.js";

const submitButton = document.getElementById("submit_button");
const findButton = document.getElementById("find_button");
const cancelFindButton = document.getElementById("cancel_find_button");
const findInput = document.getElementById("find_input");

let smartphones = [];

const onEditItem = async (e) => {
    const itemId = e.target.id.replace(EDIT_BUTTON_PREFIX, "");

    await updatesmartphone(itemId, getInputValues())

    clearInputs();

    refetchAllsmartphones();
};

export const refetchAllsmartphones = async () => {
    const allsmartphones = await getAllsmartphones();

    smartphones = allsmartphones;

    renderItemsList(smartphones, onEditItem, onRemoveItem);
};

submitButton.addEventListener("click", (event) => {
    event.preventDefault();

    const { title, description } = getInputValues();

    clearInputs();

    postsmartphone({
        title,
        description,
    }).then(refetchAllsmartphones);
});

findButton.addEventListener("click", () => {
    const foundsmartphones = smartphones.filter(
        (smartphone) => smartphone.title.search(findInput.value) !== -1
    );

    renderItemsList(foundsmartphones, onEditItem, onRemoveItem);
});

cancelFindButton.addEventListener("click", () => {
    renderItemsList(smartphones, onEditItem, onRemoveItem);

    findInput.value = "";
});

refetchAllsmartphones()
