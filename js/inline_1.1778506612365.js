
document.addEventListener("DOMContentLoaded", () => {
  // Make preview mode globally accessible
  const urlParams = new URLSearchParams(window.location.search);
  window.previewMode = urlParams.get("preview") === "true";

  loadProducts();
});

async function loadProducts() {
  const wrapper = document.querySelector(".templateNav-wrapper");
  const list = document.querySelector(".template-list");

  if (!wrapper || !list) {
    console.error("Wrapper or list not found in DOM.");
    return;
  }

  /* ---------------------------------------------------
     1) PREVIEW MODE → ALWAYS SHOW DEFAULT PRODUCTS
  --------------------------------------------------- */
  if (window.previewMode) {
    console.log("Preview mode enabled — using default products.");
    wrapper.style.display = "block";
    return; // no slider
  }

  /* ---------------------------------------------------
     2) NORMAL MODE → TRY LOADING products.json
  --------------------------------------------------- */
  try {
    const res = await fetch("/Products/products.json");

    // JSON missing → hide wrapper
    if (!res.ok) {
      console.warn("products.json not found — hiding store.");
      wrapper.style.display = "none";
      return;
    }

    // JSON exists → show wrapper
    wrapper.style.display = "block";

    const data = await res.json();
    const products = data.products ?? [];

    // Replace existing cards
    list.innerHTML = "";

    products.forEach((p) => {
      const lowestVariant = p.variants?.length
        ? p.variants.reduce((min, v) => (v.price < min.price ? v : min))
        : null;

      const price = lowestVariant ? lowestVariant.price : p.basePrice ?? "N/A";

      const card = document.createElement("div");
      card.className = "template-card";

      card.innerHTML = `
        <img src="${p.image}" alt="">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="price">€${price}</div>
        <a class="btn" href="#">Buy Now</a>
      `;

      list.appendChild(card);
    });

  } catch (err) {
    console.error("Error loading products:", err);
    wrapper.style.display = "none";
  }
}
