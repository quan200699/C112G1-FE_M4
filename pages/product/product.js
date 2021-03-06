let currentUser = localStorage.getItem('currentUser');
currentUser = JSON.parse(currentUser);// ep chuoi ve doi tuong
function getAllProduct() {
    $.ajax({
        url: `http://localhost:8080/products`,
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (products) {
            let content = '';
            for (let i = 0; i < products.length; i++) {
                content += `<tr>
        <td>${i + 1}</td>
        <td>${products[i].name}</td>
        <td>${products[i].price}</td>
        <td>${products[i].description}</td>
        <td><img src="http://localhost:8080/image/${products[i].image}"></td>
        <td>${products[i].category == null ? '' : products[i].category.name}</td>
        <td><button class="btn btn-primary"><i class="fa fa-edit" data-target="#create-product" data-toggle="modal"
                                        type="button" onclick="showEditProduct(${products[i].id})"></i></button></td>
        <td><button class="btn btn-danger" data-target="#delete-product" data-toggle="modal"
                                        type="button" onclick="showDeleteProduct(${products[i].id})"><i class="fa fa-trash"></i></button></td>
    </tr>`
            }
            $('#product-list-content').html(content);
        }
    })
}

function createNewProduct() {
    let name = $('#name').val();
    let price = $('#price').val();
    let description = $('#description').val();
    let image = $('#image');
    let category = $('#category').val();
    let product = new FormData();
    product.append('name', name);
    product.append('price', price);
    product.append('description', description);
    product.append('category', category);
    product.append('image', image.prop('files')[0]);
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/products',
        data: product,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getAllProduct();
            showSuccessMessage('T???o th??nh c??ng!');
        },
        error: function () {
            showErrorMessage('T???o l???i!');
        }
    })
}

function deleteProduct(id) {
    $.ajax({
        type: 'DELETE',
        url: `http://localhost:8080/products/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getAllProduct();
            showSuccessMessage('X??a th??nh c??ng!');
            // $('#delete-product').hide();
        },
        error: function () {
            showErrorMessage('X??a l???i');
        }
    })
}

function showDeleteProduct(id) {
    let content = `<button class="btn btn-secondary" data-dismiss="modal" type="button">????ng</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${id})" type="button">X??a</button>`;
    $('#footer-delete').html(content);
}

function showEditProduct(id) {
    let title = 'Ch???nh s???a th??ng tin s???n ph???m';
    let footer = `<button class="btn btn-secondary" data-dismiss="modal" type="button">????ng</button>
                    <button class="btn btn-primary" onclick="editProduct(${id})" type="button">C???p nh???t</button>`;
    $('#create-product-title').html(title);
    $('#create-product-footer').html(footer);
    drawCategory();
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (product) {
            $('#name').val(product.name);
            $('#price').val(product.price);
            $('#description').val(product.description);
            $('#image').val(product.image);
        }
    })
}

function editProduct(id) {
    let name = $('#name').val();
    let price = $('#price').val();
    let description = $('#description').val();
    let image = $('#image').val();
    let category = $('#category').val();
    let product = {
        name: name,
        price: price,
        description: description,
        image: image,
        category: {
            id: category
        }
    }
    $.ajax({
        type: 'PUT',
        url: `http://localhost:8080/products/${id}`,
        data: JSON.stringify(product),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            showSuccessMessage('Ch???nh s???a th??nh c??ng!');
            getAllProduct();
        },
        error: function () {
            showErrorMessage('X???y ra l???i!');
        }
    })
}

function drawCategory() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/categories',
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (categories) {
            let content = `<option>Ch???n danh m???c s???n ph???m</option>`
            for (let category of categories) {
                content += `<option value="${category.id}">${category.name}</option>`
            }
            $('#category').html(content);
        }
    })
}

$(document).ready(function () {
    if (currentUser != null) {
        getAllProduct();
    } else {
        location.href = '/demo-m4-c11G1/pages/auth/login.html'
    }
})
