// ===== FUNÇÕES DE DOM compartilhadas pelas páginas =====

// Barra do topo (Bootstrap) com o nome da loja e o ícone do carrinho.
// É colocada ANTES da div#root, então não some quando o root é redesenhado.
function criarCabecalho() {
  const linkCarrinho = document.createElement("a");
  linkCarrinho.href = "cart.html";
  linkCarrinho.className = "link-carrinho";

  const iconeCarrinho = document.createElement("img");
  iconeCarrinho.src = "imgs/icone_carrinho.png";
  iconeCarrinho.alt = "Carrinho";
  iconeCarrinho.className = "icone-carrinho";

  const contador = document.createElement("span");
  contador.id = "contador-carrinho";
  contador.className = "contador-carrinho";
  contador.textContent = getCount();

  linkCarrinho.appendChild(iconeCarrinho);
  linkCarrinho.appendChild(contador);

  const navbar = document.createElement("nav");
  navbar.className = "navbar bg-white border-bottom mb-4";

  const containerNav = document.createElement("div");
  containerNav.className = "container";

  const marca = document.createElement("a");
  marca.className = "navbar-brand fw-bold";
  marca.href = "index.html";
  marca.textContent = "☕ Café Santa Maria";

  containerNav.appendChild(marca);
  containerNav.appendChild(linkCarrinho);
  navbar.appendChild(containerNav);

  document.getElementById("root").before(navbar);
}

// 8 -> "R$ 8,00" (formato brasileiro)
function formatarPreco(valor) {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}
