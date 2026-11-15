function getCart() {
  const texto = localStorage.getItem("cart");
  if (texto === null) {
    return [];
  }
  return JSON.parse(texto);
}

function addItem(coffee, quantidade) {
  const cart = getCart();

  const existente = cart.find((item) => item.id === coffee.id);

  if (existente) {
    existente.quantity += quantidade;
  } else {
    cart.push({
      id: coffee.id,
      title: coffee.title,
      price: coffee.price,
      image: coffee.image,      // <- a linha nova, para a foto aparecer no carrinho
      quantity: quantidade,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

function getCount() {
  const cart = getCart();
  let total = 0;
  for (const item of cart) {
    total += item.quantity;
  }
  return total;
}

function atualizarContador() {
  document.getElementById("contador-carrinho").textContent = getCount();
}

function changeQuantity(id, delta) {
  const cart = getCart();

  const item = cart.find((i) => i.id === id);
  if (!item) return;

  item.quantity += delta;

  const novoCart = cart.filter((i) => i.quantity > 0);

  localStorage.setItem("cart", JSON.stringify(novoCart));
}

function getTotal() {
  const cart = getCart();
  let total = 0;
  for (const item of cart) {
    total += item.price * item.quantity;
  }
  return total;
}

function removeItem(id) {
  const cart = getCart();

  const novoCart = cart.filter((item) => item.id !== id);

  localStorage.setItem("cart", JSON.stringify(novoCart));
}

function setQuantity(id, novaQuantidade) {
  if (!Number.isInteger(novaQuantidade) || novaQuantidade < 1) return;

  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  item.quantity = novaQuantidade;

  localStorage.setItem("cart", JSON.stringify(cart));
}