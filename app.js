let inventory = [];

// 1. මේක තමයි බඩු ඇතුළත් කරන ප්‍රධාන Function එක
function addItem() {
    const nameInput = document.getElementById('itemName');
    const priceInput = document.getElementById('itemPrice');
    const qtyInput = document.getElementById('itemQty');

    if (nameInput.value === '' || priceInput.value === '' || qtyInput.value === '') {
        alert("කරුණාකර සියලුම විස්තර ඇතුළත් කරන්න!");
        return;
    }

    const newItem = {
        name: nameInput.value,
        price: priceInput.value,
        qty: qtyInput.value
    };

    // Java Server එකට දත්ත යැවීම
    fetch('http://localhost:8080/add-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
    })
    .then(response => response.text())
    .then(data => {
        console.log('Server Response:', data);
        inventory.push(newItem);
        updateTable();
        
        // Input fields හිස් කිරීම
        nameInput.value = '';
        priceInput.value = '';
        qtyInput.value = '';
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Java Server එකට දත්ත යවන්න බැහැ!");
    });
}

// 2. Table එක Update කරන කොටස
function updateTable() {
    const tableBody = document.getElementById('itemBody');
    tableBody.innerHTML = ''; 
    inventory.forEach((item, index) => {
        const row = `<tr>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>${item.qty}</td>
            <td><button class="delete-btn" onclick="deleteItem(${index})">Delete</button></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// 3. Delete කරන කොටස
function deleteItem(index) {
    const itemToDelete = inventory[index];
    fetch('http://localhost:8080/delete-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemToDelete)
    })
    .then(response => response.text())
    .then(data => {
        inventory.splice(index, 1);
        updateTable();
    })
    .catch(error => console.error('Error:', error));
}