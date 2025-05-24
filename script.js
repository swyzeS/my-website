// Отримуємо поточного користувача з localStorage
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
const isAdmin = currentUser?.role === 'admin';

// Масив товарів (або отримуємо з localStorage)
let products = JSON.parse(localStorage.getItem('products')) || [
  { id: 1, name: "Nike Air Max", price: 3000, category: "Чоловіче", image: "images/shoe.jpg" },
  { id: 2, name: "Adidas Superstar", price: 2800, category: "Жіноче", image: "images/shoe.jpg" },
  { id: 3, name: "Puma Classic", price: 2500, category: "Унісекс", image: "images/shoe.jpg" },
  { id: 4, name: "Reebok Runner", price: 2200, category: "Чоловіче", image: "images/shoe.jpg" },
  { id: 5, name: "New Balance 574", price: 2700, category: "Жіноче", image: "images/shoe.jpg" }
];

// Оновлюємо localStorage
localStorage.setItem('products', JSON.stringify(products));

const productList = document.getElementById("productList");
const categoryFilter = document.getElementById("categoryFilter");
const sortOrder = document.getElementById("sortOrder");
const adminControls = document.getElementById("adminControls");
const addProductBtn = document.getElementById("addProductBtn");

// Показуємо адмін-панель, якщо користувач адмін
if (isAdmin) {
  adminControls.style.display = 'block';
  // Оновлюємо посилання в хедері
  document.querySelector('nav a[href="login.html"]').textContent = 'Вийти';
}

function renderProducts(list) {
  productList.innerHTML = "";
  list.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product");

    // Додаємо адмін-кнопки, якщо користувач адмін
    const adminButtons = isAdmin ? `
      <div class="admin-controls">
        <button class="admin-btn edit-btn" onclick="editProduct(${product.id})">✏️</button>
        <button class="admin-btn delete-btn" onclick="deleteProduct(${product.id})">🗑️</button>
      </div>
    ` : '';

    card.innerHTML = `
      ${adminButtons}
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.price} грн</p>
      <a href="product.html?id=${product.id}" class="view-btn">Деталі</a>
      <button onclick="addToCart(${product.id})">До кошика</button>
    `;

    productList.appendChild(card);
  });
}

function filterAndSortProducts() {
  let filtered = [...products];

  const category = categoryFilter.value;
  if (category !== "all") {
    filtered = filtered.filter(p => p.category === category);
  }

  const sort = sortOrder.value;
  if (sort === "priceAsc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "priceDesc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  renderProducts(filtered);
}

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Товар додано до кошика!");
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("cart-count").textContent = cart.length;
}

// Адмін-функції
function deleteProduct(id) {
  if (confirm('Ви впевнені, що хочете видалити цей товар?')) {
    products = products.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(products));
    filterAndSortProducts();
  }
}

function editProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const newName = prompt('Нова назва товару:', product.name);
  if (newName === null) return;

  const newPrice = prompt('Нова ціна:', product.price);
  if (newPrice === null) return;

  const newCategory = prompt('Нова категорія (Чоловіче/Жіноче/Унісекс):', product.category);
  if (newCategory === null) return;

  product.name = newName;
  product.price = parseInt(newPrice);
  product.category = newCategory;

  localStorage.setItem('products', JSON.stringify(products));
  filterAndSortProducts();
}

addProductBtn.addEventListener('click', () => {
  const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const name = prompt('Назва товару:');
  if (!name) return;

  const price = prompt('Ціна:');
  if (!price) return;

  const category = prompt('Категорія (Чоловіче/Жіноче/Унісекс):');
  if (!category) return;

  const newProduct = {
    id,
    name,
    price: parseInt(price),
    category,
    image: "images/shoe.jpg" // За замовчуванням
  };

  products.push(newProduct);
  localStorage.setItem('products', JSON.stringify(products));
  filterAndSortProducts();
});

// Події фільтра та сортування
categoryFilter.addEventListener("change", filterAndSortProducts);
sortOrder.addEventListener("change", filterAndSortProducts);

// Початкова ініціалізація
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
  updateCartCount();
});