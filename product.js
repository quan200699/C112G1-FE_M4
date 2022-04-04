function getAllProduct() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/products',
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
    product.append('name',name);
    product.append('price', price);
    product.append('description', description);
    product.append('category', category);
    product.append('image',image.prop('files')[0]);
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/products',
        data: product,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function () {
            getAllProduct();
            showSuccessMessage('Tạo thành công!');
        },
        error: function () {
            showErrorMessage('Tạo lỗi!');
        }
    })
}

function showSuccessMessage(message) {
    $(function () {
        var Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        Toast.fire({
            icon: 'success',
            title: message
        })
    });
}

function showErrorMessage(message) {
    $(function () {
        var Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        Toast.fire({
            icon: 'error',
            title: message
        })
    });
}

function deleteProduct(id) {
    $.ajax({
        type: 'DELETE',
        url: `http://localhost:8080/products/${id}`,
        success: function () {
            getAllProduct();
            showSuccessMessage('Xóa thành công!');
            // $('#delete-product').hide();
        },
        error: function () {
            showErrorMessage('Xóa lỗi');
        }
    })
}

function showDeleteProduct(id) {
    let content = `<button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${id})" type="button">Xóa</button>`;
    $('#footer-delete').html(content);
}

function showEditProduct(id) {
    let title = 'Chỉnh sửa thông tin sản phẩm';
    let footer = `<button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-primary" onclick="editProduct(${id})" type="button">Cập nhật</button>`;
    $('#create-product-title').html(title);
    $('#create-product-footer').html(footer);
    drawCategory();
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products/${id}`,
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
            'Content-Type': 'application/json'
        },
        success: function () {
            showSuccessMessage('Chỉnh sửa thành công!');
            getAllProduct();
        },
        error: function () {
            showErrorMessage('Xảy ra lỗi!');
        }
    })
}

function drawCategory() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/categories',
        success: function (categories) {
            let content = `<option>Chọn danh mục sản phẩm</option>`
            for (let category of categories) {
                content += `<option value="${category.id}">${category.name}</option>`
            }
            $('#category').html(content);
        }
    })
}

$(document).ready(function () {
    getAllProduct();
})
