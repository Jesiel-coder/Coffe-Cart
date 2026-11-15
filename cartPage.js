const root = document.getElementById("root");

function criarItemCarrinho(item) {
  const linha = document.createElement("div");
  linha.className = "item-carrinho";

  const foto = document.createElement("img");
  foto.src = item.image;
  foto.alt = item.title;
  foto.className = "foto-carrinho";

  const info = document.createElement("div");

  const nome = document.createElement("h3");
  nome.textContent = item.title;

  const preco = document.createElement("p");
  preco.textContent = `R$ ${item.price.toFixed(2)}`;

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
  inputQuantidade.value = item.quantity;
  inputQuantidade.min = 1;
  inputQuantidade.value = item.quantity;
  inputQuantidade.className = "input-quantidade";

  inputQuantidade.addEventListener("change", () => {
    setQuantity(item.id, parseInt(inputQuantidade.value));
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

function renderizar() {
  root.innerHTML = "";          
  const cart = getCart();      

  if (cart.length === 0) {
    const vazio = document.createElement("p");
    vazio.textContent = "Seu carrinho está vazio.";
    root.appendChild(vazio);
    return;                     
  }

  for (const item of cart) {
    root.appendChild(criarItemCarrinho(item));
  }

  const total = document.createElement("p");
  total.className = "total-carrinho";
  total.textContent = `Total: R$ ${getTotal().toFixed(2)}`;
  root.appendChild(total);
}
// desenha quando a pagina abre
renderizar();   