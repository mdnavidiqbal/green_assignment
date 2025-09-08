let activeCategoryId = null;

// Load Categories
const loadCategories = async () => {
  const res = await fetch("https://openapi.programming-hero.com/api/categories");
  const data = await res.json();
  displayCategories(data.categories);
};

const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("categories");
  categoryContainer.innerHTML = "";

  categories.forEach((cat) => {
    const button = document.createElement("button");
    button.innerText = cat.category_name;
    button.className =
      "px-4 py-2 rounded-lg bg-green-200 hover:bg-green-400 transition font-medium";

    button.onclick = () => {
      activeCategoryId = cat.id;

      // Active state
      document.querySelectorAll("#categories button").forEach((btn) =>
        btn.classList.remove("bg-green-600", "text-white")
      );
      button.classList.add("bg-green-600", "text-white");

      loadPlantsByCategory(cat.id);
    };

    categoryContainer.appendChild(button);
  });
};

// Load All Plants (default view)
const loadAllPlants = async () => {
  document.getElementById("plants").innerHTML = `<p>Loading...</p>`;
  const res = await fetch("https://openapi.programming-hero.com/api/plants");
  const data = await res.json();
  displayPlants(data.plants.slice(0, 6));
};

// Load Plants by Category (show all from that category)
const loadPlantsByCategory = async (id) => {
  document.getElementById("plants").innerHTML = `<p>Loading...</p>`;
  const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
  const data = await res.json();
  displayPlants(data.plants);
};

// Display Plant Cards
const displayPlants = (plants) => {
  const plantsContainer = document.getElementById("plants");
  plantsContainer.innerHTML = "";

  if (!plants || plants.length === 0) {
    plantsContainer.innerHTML = `<p class="text-red-500">No plants found!</p>`;
    return;
  }

  plants.forEach((plant) => {
    const card = document.createElement("div");
    card.className =
      "bg-white shadow-md rounded-2xl p-4 flex flex-col transition hover:shadow-xl hover:scale-[1.02] duration-300";

    card.innerHTML = `
      <!-- Image -->
      <img src="${plant.image}" alt="${plant.name}"
            class="rounded-xl mb-4 h-44 w-full object-cover">

      <h2 class="font-bold">${plant.name}</h2>

      <!-- Description -->
      <p class="text-gray-600 text-sm mb-4">${plant.description.slice(0, 60)}...</p>

      <!-- Name + Price Row -->
      <div class="flex justify-between items-center mb-3">
        <button class="text-green-700 font-semibold hover:bg-green-200 bg-green-100 px-2 py-1 rounded-xl ">
          ${plant.name}
        </button>
        <span class="text-black-700 font-bold bg-white px-2 py-1 ">$${plant.price}</span>
      </div>

      <!-- Add to Cart -->
      <button class="bg-green-600 text-white font-medium px-4 py-2 rounded-lg mt-auto hover:bg-green-700 transition">
        Add to Cart
      </button>
    `;

    // Event Listeners
    card.querySelector("button.text-green-700").onclick = () => loadPlantDetails(plant.id); 
    card.querySelector("button.bg-green-600").onclick = () => addToCart(plant); 

    plantsContainer.appendChild(card);
  });
};

// Load Single Plant Details (Modal)
const loadPlantDetails = async (id) => {
  const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
  const data = await res.json();
  console.log("Plant details:", data);
  displayPlantDetails(data.plants); 
};

const displayPlantDetails = (plant) => {
  const modal = document.getElementById("plantModal");
  const modalContent = document.getElementById("modalContent");

  modalContent.innerHTML = `
    <img src="${plant.image}" alt="${plant.name}" class="rounded-lg mb-4 w-full h-60 object-cover">
    <h2 class="text-2xl font-bold mb-2 text-green-700">${plant.name}</h2>
    <p class="mb-2"><strong>Category:</strong> ${plant.category}</p>
    <p class="mb-2"><strong>Price:</strong> $${plant.price}</p>
    <p class="mb-4 text-gray-700 leading-relaxed">${plant.description}</p>
    <button onclick="closeModal()"
       class="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition">
      Close
    </button>
  `;

  modal.classList.remove("hidden");

  // Overlay click to close
  modal.onclick = (e) => {
    if (e.target === modal) {
      closeModal();
    }
  };
};

const closeModal = () => {
  document.getElementById("plantModal").classList.add("hidden");
};

// Cart System
let cart = [];
let total = 0;

const addToCart = (plant) => {
  const price = parseFloat(plant.price) || 0; // ensure number
  cart.push({ ...plant, price });
  total += price;
  updateCart();
  alert(`${plant.name} has been added to your cart!`);
};

const removeFromCart = (index) => {
  total -= cart[index].price;
  cart.splice(index, 1);
  updateCart();
};

const updateCart = () => {
  const cartList = document.getElementById("cart");
  cartList.innerHTML = "";
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center bg-green-100 p-2 rounded-lg mb-2";
    li.innerHTML = `
      <span class="font-medium">${item.name}</span>
      <button class="text-red-500 hover:text-red-700 transition" onclick="removeFromCart(${index})">❌</button>
    `;
    cartList.appendChild(li);
  });
  document.getElementById("total").innerText = total.toFixed(2);
};

loadCategories();
loadAllPlants();