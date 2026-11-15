// ===== CARRINHO (localStorage) =====
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
      price: coffee.price ?? 0,
      image: coffee.image,
      quantity: quantidade,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

// delta = +1 (aumenta) ou -1 (diminui); se chegar a 0, o item sai
function changeQuantity(id, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  item.quantity += delta;
  const novoCart = cart.filter((i) => i.quantity > 0);
  localStorage.setItem("cart", JSON.stringify(novoCart));
}

// define a quantidade direto (usado quando a pessoa digita o número)
function setQuantity(id, novaQuantidade) {
  if (!Number.isInteger(novaQuantidade) || novaQuantidade < 1) return;

  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  item.quantity = novaQuantidade;
  localStorage.setItem("cart", JSON.stringify(cart));
}

// tira o item inteiro do carrinho
function removeItem(id) {
  const cart = getCart();
  const novoCart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(novoCart));
}

function clearCart() {
  localStorage.removeItem("cart");
}

function getCount() {
  const cart = getCart();
  let total = 0;
  for (const item of cart) {
    total += item.quantity;
  }
  return total;
}

function getTotal() {
  const cart = getCart();
  let total = 0;
  for (const item of cart) {
    total += item.price * item.quantity;
  }
  return total;
}

// atualiza o número da bolinha do cabeçalho
function atualizarContador() {
  const contador = document.getElementById("contador-carrinho");
  if (contador) {
    contador.textContent = getCount();
  }
}
