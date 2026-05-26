const productsContainer = document.getElementById("hot-deals-container");

async function getProducts() {
  try {
    const res = await apiFetch("http://127.0.0.1:8000/api/products/");
    const products = await res.json();

    productsContainer.innerHTML = "";

    const featuredProducts = products.filter(p => p.featured === true);
    featuredProducts.forEach(product => {
      const div = document.createElement("article");
      div.classList.add("product-card");

      div.innerHTML = `
        <img src="${product.image}" class="product-thumb" />

        <h3>${product.name}</h3>

        <small>
          ${product.brand?.name || "N/A"}<br/>
        </small>
        <p>${product.price} EGP</p>

        <button class="btn btn--cart">ADD TO CART</button>
      `;

      productsContainer.appendChild(div);
    });

  } catch (err) {
    console.log(err);
  }
}

getProducts();