async function loadFeaturedBundle() {
    console.log("loadFeaturedBundle CALLED");
    try {
        const res = await apiFetch("http://127.0.0.1:8000/api/bundles/");
        const bundles = await res.json();

        console.log("bundles:", bundles);

        if (!bundles || bundles.length === 0) return;

        const bundle = bundles.find(b => b.featured === true) || bundles[0];

        const container = document.getElementById("featured-build-container");
        if (!container) return;

        const totalProductsPrice = (bundle.products || [])
            .reduce((sum, product) => sum + (product.price || 0), 0);

        const bundlePrice = bundle.price || totalProductsPrice;

        const save = totalProductsPrice - bundlePrice;

        container.innerHTML = `
            <div class="featured-showcase">

                <div class="featured-image">
                    <img src="${bundle.image || ''}" alt="${bundle.name || ''}">
                </div>

                <div class="featured-content">

                    <h2>${bundle.name || ''}</h2>

                    <p>${bundle.description || ''}</p>

                    <ul class="spec-chips">
                        ${(bundle.products || []).map(product => `
                            <li class="spec-chip">
                                <span class="spec-chip__icon">PC</span>
                                ${product.name}
                            </li>
                        `).join("")}
                    </ul>

                    <div class="featured-price">
                        <span class="featured-price__old">
                            ${totalProductsPrice} EGP
                        </span>

                        <span class="featured-price__now">
                            ${bundlePrice} EGP
                        </span>

                        <span class="featured-price__save">
                            Save ${save > 0 ? save : 0} EGP
                        </span>
                    </div>
                    <button class="btn btn--primary">
                        <span>ADD TO CART</span>
                    </button>

                </div>

            </div>
        `;
    } catch (err) {
        console.log(err);
    }
}

loadFeaturedBundle();