


const usersContainer = document.getElementById("users-container");
const userCount = document.getElementById("user-count");

// dashboard.js
const categoriesContainer = document.getElementById("admin-categories-container");
const categoryInput = document.getElementById("category-name");

async function getUsers(){

    try{

        const response = await fetch("http://127.0.0.1:8000/user",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        if(response.status === 401 || response.status === 403){
            alert("Unauthorized");
            window.location.href = "/login";
            return;
        }

        const data = await response.json();

        usersContainer.innerHTML = "";

        userCount.textContent = data.users.length;

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

            usersContainer.appendChild(card);

        });

    }catch(error){
        console.log(error);
    }
}

async function deleteUser(userId){

    const confirmDelete = confirm("Delete user?");

    if(!confirmDelete) return;

    try{

        await fetch(`http://127.0.0.1:8000/user/${userId}`,{
            method:"DELETE",

            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        getUsers();

    }catch(error){
        console.log(error);
    }
}







async function getCategories() {
    try {
        const res = await fetch("http://127.0.0.1:8000/categories", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (res.status === 401 || res.status === 403) {
            alert("Unauthorized");
            window.location.href = "/login";
            return;
        }

        const data = await res.json();

        categoriesContainer.innerHTML = "";

            data.forEach(category => {
                const div = document.createElement("div");
                div.classList.add("category-card");
                div.innerHTML = `
                    <span>${category.icon || "📦"} ${category.name}</span>
                    <div style="display:flex; gap:8px;">
                        <button onclick='openEditModal(${JSON.stringify(category)})'>Edit</button>
                        <button onclick="deleteCategory(${category.id})">Delete</button>
                    </div>
                `;
                categoriesContainer.appendChild(div);
            });

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
        const res = await fetch("http://127.0.0.1:8000/categories", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
                // no Content-Type header — browser sets it automatically for FormData
            },
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

function openEditModal(category) {
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
        const res = await fetch(`http://127.0.0.1:8000/categories/${id}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
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
        await fetch(`http://127.0.0.1:8000/categories/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        getCategories();

    } catch (err) {
        console.log(err);
    }
}

getUsers();
getCategories();