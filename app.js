let inventory = [];

// 1. This is the main function that loads goods.
function addItem() {
    const nameInput = document.getElementById('itemName');
    const priceInput = document.getElementById('itemPrice');
    const qtyInput = document.getElementById('itemQty');

    if (nameInput.value === '' || priceInput.value === '' || qtyInput.value === '') {
        alert("Please enter all details!");
        return;
    }

    const newItem = {
        name: nameInput.value,
        price: priceInput.value,
        qty: qtyInput.value
    };

    // Send data to java server
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
        
        // Clearing input fields
        nameInput.value = '';
        priceInput.value = '';
        qtyInput.value = '';
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Unable to send data to Java Server");
    });
}

// 2. Update table
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

// 3. Delete 
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
