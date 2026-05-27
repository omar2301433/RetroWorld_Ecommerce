


const usersContainer = document.getElementById("users-container");
const userCount = document.getElementById("user-count");

// dashboard.js
const categoriesContainer = document.getElementById("admin-categories-container");
const categoryInput = document.getElementById("category-name");
const categoryCount = document.getElementById("category-count");

const brandsContainer = document.getElementById("admin-brands-container");
const brandInput = document.getElementById("brand-name");
const brandCount = document.getElementById("brand-count");

const bundlesContainer = document.getElementById("admin-bundles-container");
const bundleCount = document.getElementById("bundle-count");

const productsContainer =
    document.getElementById("admin-products-container");

const productCount =
    document.getElementById("product-count");

async function getUsers(){

    try{

        const response = await apiFetch("http://127.0.0.1:8000/api/auth/user");

        if(response.status === 401 || response.status === 403){
            alert("Unauthorized");
            window.location.href = "../html/login.html";
            return;
        }

         
        const data = await response.json();

        if (usersContainer) {
            usersContainer.innerHTML = "";
        }

       

        data.users.forEach(user => {

            const card = document.createElement("div");

            card.classList.add("user-card");

            card.innerHTML = `
                <div>
                    <h3>${user.username}</h3>
                    <p>${user.email}</p>
                    <small>${user.role}</small>
                </div>

                <button class="delete-btn"
                    onclick="deleteUser(${user.id})">
                    Delete
                </button>
            `;

           
            if (usersContainer) {
                usersContainer.appendChild(card);
            }
            

        });
        if (userCount) {
            userCount.textContent = data.users.length;
        }
    }catch(error){
        console.log(error);
    }
}

async function deleteUser(userId){

    const confirmDelete = confirm("Delete user?");

    if(!confirmDelete) return;

    try{

        await apiFetch(`http://127.0.0.1:8000/api/auth/user/${userId}`,{
            method:"DELETE"
        });

        getUsers();

    }catch(error){
        console.log(error);
    }
}





async function getCategories() {
    try {
        const res = await apiFetch("http://127.0.0.1:8000/api/categories");

        if (res.status === 401 || res.status === 403) {
            alert("Unauthorized");
            window.location.href = "../html/login.html";
            return;
        }

        const data = await res.json();

        if (categoriesContainer) {
            categoriesContainer.innerHTML = "";
        }

            data.forEach(category => {
                const div = document.createElement("div");
                div.classList.add("category-card");
                div.innerHTML = `
                <div class="category-card">
                    <img src="${category.image}" class="category-img" />

                    <div>
                        <span>${category.icon || "📦"} ${category.name}</span>
                    </div>

                    <div style="display:flex; gap:8px;">
                        <button onclick='openCategoryEditModal(${JSON.stringify(category)})'>Edit</button>
                        <button onclick="deleteCategory(${category.id})">Delete</button>
                    </div>
                </div>
            `;
                if (categoriesContainer) {
                    categoriesContainer.appendChild(div);
                }
            });
            if (categoryCount) {
                categoryCount.textContent = data.length;
            }
            } catch (err) {
                console.log(err);
            }
        }



async function addCategory() {
    const name = document.getElementById("category-name").value.trim();
    const slug = document.getElementById("category-slug").value.trim()
        .toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const icon = document.getElementById("category-icon").value.trim();
    const description = document.getElementById("category-description").value.trim();
    const imageFile = document.getElementById("category-image").files[0];

    if (!name) return alert("Category name required");
    if (!slug) return alert("Slug required");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    if (icon) formData.append("icon", icon);
    if (description) formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    try {
        const res = await apiFetch("http://127.0.0.1:8000/api/categories", {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            const err = await res.json();
            return alert(err.detail || "Failed to add category");
        }

        document.getElementById("category-name").value = "";
        document.getElementById("category-slug").value = "";
        document.getElementById("category-icon").value = "";
        document.getElementById("category-description").value = "";
        document.getElementById("category-image").value = "";

        getCategories();

    } catch (err) {
        console.log(err);
    }
}

function openCategoryEditModal(category) {
    document.getElementById("edit-category-id").value = category.id;
    document.getElementById("edit-category-name").value = category.name;
    document.getElementById("edit-category-slug").value = category.slug;
    document.getElementById("edit-category-icon").value = category.icon || "";
    document.getElementById("edit-category-description").value = category.description || "";
    document.getElementById("edit-category-image").value = "";

    const modal = document.getElementById("edit-modal");
    modal.style.display = "flex";
}

function closeEditModal() {
    document.getElementById("edit-modal").style.display = "none";
}

async function submitUpdateCategory() {
    const id = document.getElementById("edit-category-id").value;
    const name = document.getElementById("edit-category-name").value.trim();
    const slug = document.getElementById("edit-category-slug").value.trim()
        .toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const icon = document.getElementById("edit-category-icon").value.trim();
    const description = document.getElementById("edit-category-description").value.trim();
    const imageFile = document.getElementById("edit-category-image").files[0];

    if (!name) return alert("Name required");
    if (!slug) return alert("Slug required");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    if (icon) formData.append("icon", icon);
    if (description) formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    try {
        const res = await apiFetch(`http://127.0.0.1:8000/api/categories/${id}`, {
            method: "PUT",
            body: formData
        });

        if (!res.ok) {
            const err = await res.json();
            return alert(err.detail || "Failed to update category");
        }

        closeEditModal();
        getCategories();

    } catch (err) {
        console.log(err);
    }
}



async function deleteCategory(id) {
    const confirmDelete = confirm("Delete category?");
    if (!confirmDelete) return;

    try {
        await apiFetch(`http://127.0.0.1:8000/api/categories/${id}`, {
            method: "DELETE",
            
        });

        getCategories();

    } catch (err) {
        console.log(err);
    }
}

async function loadProductCategories() {

    try {

        const res = await apiFetch(
            "http://127.0.0.1:8000/api/categories"
        );

        const categories = await res.json();

        const addSelect =
            document.getElementById("product-category");

        const editSelect =
            document.getElementById("edit-product-category");

        // Fill Add Product Select
        if (addSelect) {

            addSelect.innerHTML = `
                <option value="">
                    Select Category
                </option>
            `;

            categories.forEach(category => {

                addSelect.innerHTML += `
                    <option value="${category.id}">
                        ${category.name}
                    </option>
                `;

            });

        }

        // Fill Edit Product Select
        if (editSelect) {

            editSelect.innerHTML = `
                <option value="">
                    Select Category
                </option>
            `;

            categories.forEach(category => {

                editSelect.innerHTML += `
                    <option value="${category.id}">
                        ${category.name}
                    </option>
                `;

            });

        }

    } catch (err) {

        console.log(err);

    }

}








async function getBrands() {
    try {
        const res = await apiFetch("http://127.0.0.1:8000/api/brands");

        if (res.status === 401 || res.status === 403) {
            alert("Unauthorized");
            window.location.href = "../html/login.html";
            return;
        }

        const data = await res.json();

        if (brandsContainer) {
            brandsContainer.innerHTML = "";
        }

            data.forEach(brand => {
                const div = document.createElement("div");
                div.classList.add("category-card");
                div.innerHTML = `
                <div class="category-card">
                    <img src="${brand.image}" class="category-img" />

                    <div>
                         ${brand.name}</span>
                    </div>

                    <div style="display:flex; gap:8px;">
                        <button onclick='openBrandEditModal(${JSON.stringify(brand)})'>Edit</button>
                        <button onclick="deleteBrand(${brand.id})">Delete</button>
                    </div>
                </div>
            `;
                if (brandsContainer) {
                    brandsContainer.appendChild(div);
                }
            });
            if (brandCount) {
                brandCount.textContent = data.length;
            }
            } catch (err) {
                console.log(err);
            }
        }



async function addBrand() {
    const name = document.getElementById("brand-name").value.trim();
    const description = document.getElementById("brand-description").value.trim();
    const imageFile = document.getElementById("brand-image").files[0];

    if (!name) return alert("Brand  name required");

    const formData = new FormData();
    formData.append("name", name);
    if (description) formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    try {
        const res = await apiFetch("http://127.0.0.1:8000/api/brands", {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            const err = await res.json();
            return alert(err.detail || "Failed to add brand");
        }

        document.getElementById("brand-name").value = "";
        document.getElementById("brand-description").value = "";
        document.getElementById("brand-image").value = "";

        getBrands();

    } catch (err) {
        console.log(err);
    }
}

function openBrandEditModal(brand) {
    document.getElementById("edit-brand-id").value = brand.id;
    document.getElementById("edit-brand-name").value = brand.name;
    document.getElementById("edit-brand-description").value = brand.description || "";
    document.getElementById("edit-brand-image").value = "";

    const modal = document.getElementById("edit-modal");
    modal.style.display = "flex";
}



async function submitUpdateBrand() {
    const id = document.getElementById("edit-brand-id").value;
    const name = document.getElementById("edit-brand-name").value.trim();
    const description = document.getElementById("edit-brand-description").value.trim();
    const imageFile = document.getElementById("edit-brand-image").files[0];

    if (!name) return alert("Name required");


    const formData = new FormData();
    formData.append("name", name);
    if (description) formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    try {
        const res = await apiFetch(`http://127.0.0.1:8000/api/brands/${id}`, {
            method: "PUT",
            body: formData
        });

        if (!res.ok) {
            const err = await res.json();
            return alert(err.detail || "Failed to update brand");
        }

        closeEditModal();
        getBrands();

    } catch (err) {
        console.log(err);
    }
}



async function deleteBrand(id) {
    const confirmDelete = confirm("Delete brand?");
    if (!confirmDelete) return;

    try {
        await apiFetch(`http://127.0.0.1:8000/api/brands/${id}`, {
            method: "DELETE",
            
        });

        getBrands();

    } catch (err) {
        console.log(err);
    }
}

async function loadProductBrands() {

    try {

        const res = await apiFetch(
            "http://127.0.0.1:8000/api/brands"
        );

        const brands = await res.json();

        const addSelect =
            document.getElementById("product-brand");

        const editSelect =
            document.getElementById("edit-product-brand");

        // Fill Add Product Select
        if (addSelect) {

            addSelect.innerHTML = `
                <option value="">
                    Select Brand
                </option>
            `;

            brands.forEach(brand => {

                addSelect.innerHTML += `
                    <option value="${brand.id}">
                        ${brand.name}
                    </option>
                `;

            });

        }

        // Fill Edit Product Select
        if (editSelect) {

            editSelect.innerHTML = `
                <option value="">
                    Select Brand
                </option>
            `;

            brands.forEach(brand => {

                editSelect.innerHTML += `
                    <option value="${brand.id}">
                        ${brand.name}
                    </option>
                `;

            });

        }

    } catch (err) {

        console.log(err);

    }

}



async function addProduct() {

    const formData = new FormData(); 

    const name = document.getElementById("product-name").value.trim();
    const categoryId = document.getElementById("product-category").value;
    const brandId = document.getElementById("product-brand").value;
    const price = document.getElementById("product-price").value.trim();
    const description = document.getElementById("product-description").value.trim();
    const imageFile = document.getElementById("product-image").files[0];
    const featured = document.getElementById("product-featured").checked;

    if (!name) return alert("Product name required");
    if (!categoryId) return alert("Select category");
    if (!brandId) return alert("Select brand");
    if (!price) return alert("Price required");

    formData.append("name", name);
    formData.append("category_id", categoryId);
    formData.append("brand_id", brandId);
    formData.append("price", price);

    if (description) {
        formData.append("description", description);
    }

    if (imageFile) {
        formData.append("image", imageFile);
    }

    if (featured) {
        formData.append("featured", "true");
    }

    try {
        const res = await apiFetch("http://127.0.0.1:8000/api/products/", {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            const err = await res.json();
            return alert(err.detail || "Failed to add product");
        }

        document.getElementById("product-name").value = "";
        document.getElementById("product-category").value = "";
        document.getElementById("product-brand").value = "";
        document.getElementById("product-price").value = "";
        document.getElementById("product-description").value = "";
        document.getElementById("product-image").value = "";
        document.getElementById("product-featured").checked = false;

        getProducts();

    } catch (err) {
        console.log(err);
    }
}


async function getProducts() {

    try {

        const res = await apiFetch("http://127.0.0.1:8000/api/products/");

        const products = await res.json();

        if (productsContainer) {
            productsContainer.innerHTML = "";
        }

        products.forEach(product => {

            const div = document.createElement("div");

            div.classList.add("product-card");

            div.innerHTML = `
                    <img 
                        src="${product.image}"
                        class="product-img"
                    />

                    <div class="product-content">
                        <h3>${product.name}</h3>

                        <p>${product.description || ""}</p>
                        <small>Category: ${product.category?.name}</small>
                        <small>Brand: ${product.brand?.name}</small>
                        <p>${product.price} EGP</p>
                        <small>Featured: ${product.featured ? "Yes" : "No"}</small>
                    </div>

                    <div class="product-actions">
                        <button onclick='openProductEditModal(${JSON.stringify(product)})'>Edit</button>
                        <button onclick="deleteProduct(${product.id})">
                            Delete
                        </button>
                    </div>
                `;
            
            if (productsContainer) {
                productsContainer.appendChild(div);
            }
        });

        if (productCount) {
            productCount.textContent = products.length;
        }

    } catch (err) {

        console.log(err);

    }

}


function openProductEditModal(product) {
    document.getElementById("edit-product-id").value = product.id;
    document.getElementById("edit-product-name").value = product.name;
    document.getElementById("edit-product-category").value = product.category?.id || "";
    document.getElementById("edit-product-brand").value = product.brand?.id || "";
    document.getElementById("edit-product-price").value = product.price;
    document.getElementById("edit-product-description").value = product.description || "";
    document.getElementById("edit-product-image").value = "";
    document.getElementById("edit-product-featured").checked = product.featured;

    const modal = document.getElementById("edit-modal");
    modal.style.display = "flex";
}


async function submitUpdateProduct() {

    const id =
        document.getElementById("edit-product-id").value;

    const name =
        document.getElementById("edit-product-name").value.trim();

    const category =
        document.getElementById("edit-product-category").value;
    const brand =
        document.getElementById("edit-product-brand").value;    

    const price =
        document.getElementById("edit-product-price").value;

    const description =
        document.getElementById("edit-product-description").value.trim();

    const imageFile =
        document.getElementById("edit-product-image").files[0];
    const featured =
        document.getElementById("edit-product-featured").checked;    

    if (!name) return alert("Name required");

    if (!category) return alert("Category required");

    if (!price) return alert("Price required");

    const formData = new FormData();

    formData.append("name", name);

    // FIX HERE
    formData.append("category_id", category);
    formData.append("brand_id", brand);
    formData.append("price", price);
    formData.append("featured", featured ? "true" : "false");
    if (description) {
        formData.append("description", description);
    }

    if (imageFile) {
        formData.append("image", imageFile);
    }

    try {

        const res = await apiFetch(
            `http://127.0.0.1:8000/api/products/${id}`,
            {
                method: "PUT",
                body: formData
            }
        );

        if (!res.ok) {

            const err = await res.json();

            return alert(
                err.detail || "Failed to update product"
            );

        }

        closeEditModal();

        getProducts();

    } catch (err) {

        console.log(err);

    }

}



async function deleteProduct(id) {

    const confirmDelete =
        confirm("Delete product?");

    if (!confirmDelete) return;

    try {

        await apiFetch(
            `http://127.0.0.1:8000/api/products/${id}`,
            {
                method: "DELETE",
            }
        );

        getProducts();

    } catch (err) {

        console.log(err);

    }

}


// =========================
// BUNDLES
// =========================



async function loadBundleProducts() {

    try {

        const res = await apiFetch(
            "http://127.0.0.1:8000/api/products/"
        );

        const products = await res.json();

        const addContainer =
            document.getElementById("bundle-products");

        const editContainer =
            document.getElementById("edit-bundle-products");

        addContainer.innerHTML = "";
        editContainer.innerHTML = "";

        products.forEach(product => {
            const item = `
                <label class="bundle-product-item">
                    <input type="checkbox" value="${product.id}">
                    <span>${product.name}</span>
                </label>
            `;

            addContainer.innerHTML += item;
            editContainer.innerHTML += item;
        });

            } catch (err) {

                console.log(err);

            }

        }

        const bundleImageInput =
            document.getElementById("bundle-image");

        const bundlePreview =
            document.getElementById("bundle-preview");

        if (bundleImageInput) {

            bundleImageInput.addEventListener("change", () => {

                const file =
                    bundleImageInput.files[0];

                if (file) {

                    bundlePreview.src =
                        URL.createObjectURL(file);

                    bundlePreview.style.display =
                        "block";

                }

            });

        }



// ADD BUNDLE
async function addBundle() {

    

    const name =
        document.getElementById("bundle-name")
        .value.trim();

    const description =
        document.getElementById("bundle-description")
        .value.trim();

    const price =
        document.getElementById("bundle-price")
        .value;

    const featured =
        document.getElementById("bundle-featured")
        .checked;

    const imageFile =
        document.getElementById("bundle-image")
        .files[0];

    const productsSelect =
        document.getElementById("bundle-products");

    const selectedProducts = Array.from(
    document.querySelectorAll("#bundle-products input[type='checkbox']:checked")
    ).map(input => input.value);

    if (!name) {
        return alert("Bundle name required");
    }

    if (!price) {
        return alert("Bundle price required");
    }

    if (selectedProducts.length === 0) {
        return alert("Select at least one product");
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);

    formData.append(
        "featured",
        featured ? "true" : "false"
    );

    formData.append(
        "product_ids",
        selectedProducts.join(",")
    );

    if (imageFile) {

        formData.append(
            "image",
            imageFile
        );

    }

    try {

        const res = await apiFetch(
            "http://127.0.0.1:8000/api/bundles/",
            {
                method: "POST",
                body: formData
            }
        );

        if (!res.ok) {

            const err = await res.json();

            return alert(
                err.detail || "Failed to add bundle"
            );

        }

        // RESET
        document.getElementById("bundle-name").value = "";
        document.getElementById("bundle-description").value = "";
        document.getElementById("bundle-price").value = "";
        document.getElementById("bundle-featured").checked = false;
        document.getElementById("bundle-image").value = "";

        bundlePreview.style.display = "none";

        Array.from(document.querySelectorAll("#bundle-products input[type='checkbox']"))
            .forEach(checkbox => checkbox.checked = false);

        getBundles();

    } catch (err) {

        console.log(err);

    }

}



async function getBundles() {

    try {

        const res = await apiFetch(
            "http://127.0.0.1:8000/api/bundles/"
        );

        const bundles = await res.json();

        if (bundlesContainer) {

            bundlesContainer.innerHTML = "";

        }

        bundles.forEach(bundle => {

            const div =
                document.createElement("div");

            div.classList.add("product-card");

            div.innerHTML = `

                <img
                    src="${bundle.image}"
                    class="product-img"
                />

                <div class="product-content">

                    <h3>${bundle.name}</h3>

                    <p>
                        ${bundle.description || ""}
                    </p>

                    <p>
                        ${bundle.price} EGP
                    </p>

                    <small>
                        Featured:
                        ${bundle.featured ? "Yes" : "No"}
                    </small>

                    <div class="bundle-products-list">

                        ${
                            bundle.products
                            ?.map(product => `
                                <span>
                                    ${product.name}
                                </span>
                            `)
                            .join("")
                        }

                    </div>

                </div>

                <div class="product-actions">

                    <button
                        onclick='openBundleEditModal(${JSON.stringify(bundle)})'
                    >
                        Edit
                    </button>

                    <button
                        onclick="deleteBundle(${bundle.id})"
                    >
                        Delete
                    </button>

                </div>
            `;

            if (bundlesContainer) {
                bundlesContainer.appendChild(div);
            }

        });
        if (bundleCount) {
            bundleCount.textContent = bundles.length;
        }

    } catch (err) {

        console.log(err);

    }

}



// OPEN EDIT MODAL
function openBundleEditModal(bundle) {

    document.getElementById("edit-bundle-id").value =
        bundle.id;

    document.getElementById("edit-bundle-name").value =
        bundle.name;

    document.getElementById("edit-bundle-description").value =
        bundle.description || "";

    document.getElementById("edit-bundle-price").value =
        bundle.price;

    document.getElementById("edit-bundle-featured").checked =
        bundle.featured;

    const select =
        document.getElementById("edit-bundle-products");

   const checkboxes = document.querySelectorAll(
    "#edit-bundle-products input[type='checkbox']"
    );

    checkboxes.forEach(cb => {
        cb.checked = bundle.products.some(
            product => product.id == cb.value
        );
    });

    const modal =
        document.getElementById("edit-modal");

    modal.style.display = "flex";

}



// UPDATE BUNDLE
async function submitUpdateBundle() {

    const id =
        document.getElementById("edit-bundle-id")
        .value;

    const name =
        document.getElementById("edit-bundle-name")
        .value.trim();

    const description =
        document.getElementById("edit-bundle-description")
        .value.trim();

    const price =
        document.getElementById("edit-bundle-price")
        .value;

    const featured =
        document.getElementById("edit-bundle-featured")
        .checked;

    const imageFile =
        document.getElementById("edit-bundle-image")
        .files[0];

    const productsSelect =
        document.getElementById("edit-bundle-products");

    const selectedProducts =
        Array.from(
            document.querySelectorAll("#edit-bundle-products input[type='checkbox']:checked")
        )
        .map(checkbox => checkbox.value);

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);

    formData.append(
        "featured",
        featured ? "true" : "false"
    );

    formData.append(
        "product_ids",
        selectedProducts.join(",")
    );

    if (imageFile) {

        formData.append(
            "image",
            imageFile
        );

    }

    try {

        const res = await apiFetch(
            `http://127.0.0.1:8000/api/bundles/${id}`,
            {
                method: "PUT",
                body: formData
            }
        );

        if (!res.ok) {

            const err = await res.json();

            return alert(
                err.detail || "Failed to update bundle"
            );

        }

        closeEditModal();

        getBundles();

    } catch (err) {

        console.log(err);

    }

}



// DELETE BUNDLE
async function deleteBundle(id) {

    const confirmDelete =
        confirm("Delete bundle?");

    if (!confirmDelete) return;

    try {

        await apiFetch(
            `http://127.0.0.1:8000/api/bundles/${id}`,
            {
                method: "DELETE"
            }
        );

        getBundles();

    } catch (err) {

        console.log(err);

    }

}




loadBundleProducts();
getBundles();
getUsers();
getCategories();
loadProductCategories();
getProducts();
loadProductBrands();
getBrands();