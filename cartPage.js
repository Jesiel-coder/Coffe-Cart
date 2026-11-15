// ===== PREPARA A PÁGINA =====
const root = document.getElementById("root");
root.className = "container pb-5";   // centraliza o conteúdo (Bootstrap)
criarCabecalho();                    // barra do topo (vem do ui.js)

// ===== UM ITEM DO CARRINHO =====
function criarItemCarrinho(item) {
  const linha = document.createElement("div");
  linha.className = "item-carrinho";

  const foto = document.createElement("img");
  foto.src = item.image;
  foto.alt = item.title;
  foto.className = "foto-carrinho";

  const info = document.createElement("div");
  info.className = "info-carrinho";

  const nome = document.createElement("h3");
  nome.textContent = item.title;

  const preco = document.createElement("p");
  preco.textContent = formatarPreco(item.price);

  // ----- controle de quantidade -----
  const controle = document.createElement("div");
  controle.className = "controle-carrinho";

  const btnMenos = document.createElement("button");
  btnMenos.textContent = "-";
  btnMenos.addEventListener("click", () => {
    changeQuantity(item.id, -1);
    renderizar();
  });

  const inputQuantidade = document.createElement("input");
  inputQuantidade.type = "number";
  inputQuantidade.min = 1;
  inputQuantidade.value = item.quantity;
  inputQuantidade.className = "input-quantidade";

  // "change" dispara quando a pessoa termina de digitar
  inputQuantidade.addEventListener("change", () => {
    setQuantity(item.id, Number(inputQuantidade.value));
    renderizar();
  });

  const btnMais = document.createElement("button");
  btnMais.textContent = "+";
  btnMais.addEventListener("click", () => {
    changeQuantity(item.id, +1);
    renderizar();
  });

  const btnRemover = document.createElement("button");
  btnRemover.textContent = "Remover";
  btnRemover.className = "btn-remover";
  btnRemover.addEventListener("click", () => {
    removeItem(item.id);
    renderizar();
  });

  controle.appendChild(btnMenos);
  controle.appendChild(inputQuantidade);
  controle.appendChild(btnMais);
  controle.appendChild(btnRemover);

  info.appendChild(nome);
  info.appendChild(preco);
  info.appendChild(controle);

  linha.appendChild(foto);
  linha.appendChild(info);

  return linha;
}

// ===== BOTÕES DE BAIXO (voltar / finalizar) =====
function criarBotoes(comFinalizar) {
  const acoes = document.createElement("div");
  acoes.className = "acoes-carrinho";

  const voltar = document.createElement("a");
  voltar.href = "index.html";
  voltar.className = "btn btn-outline-success";
  voltar.textContent = "← Voltar ao cardápio";
  acoes.appendChild(voltar);

  if (comFinalizar) {
    const finalizar = document.createElement("a");
    finalizar.href = "buy.html";
    finalizar.className = "btn btn-success";
    finalizar.textContent = "Finalizar Compra →";
    acoes.appendChild(finalizar);
  }

  return acoes;
}

// ===== DESENHA A TELA =====
function renderizar() {
  root.innerHTML = "";
  const cart = getCart();

  const titulo = document.createElement("h1");
  titulo.className = "h3 fw-bold text-center mb-4";
  titulo.textContent = "Seu carrinho";
  root.appendChild(titulo);

  if (cart.length === 0) {
    const vazio = document.createElement("div");
    vazio.className = "alert alert-info text-center mx-auto";
    vazio.style.maxWidth = "600px";
    vazio.textContent = "Seu carrinho está vazio.";
    root.appendChild(vazio);
    root.appendChild(criarBotoes(false));
    return;
  }

  for (const item of cart) {
    root.appendChild(criarItemCarrinho(item));
  }

  const total = document.createElement("p");
  total.className = "total-carrinho";
  total.textContent = "Total: " + formatarPreco(getTotal());
  root.appendChild(total);

  root.appendChild(criarBotoes(true));
}

renderizar();
