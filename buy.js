// ===== RESUMO DO PEDIDO =====
const carrinho = getCart();
const resumoDiv = document.getElementById("resumo-pedido");
const total = getTotal();

if (carrinho.length === 0) {
  resumoDiv.innerHTML = "<p class='carrinho-vazio'>Seu carrinho está vazio. Adicione itens antes de finalizar.</p>";
  document.getElementById("checkout-form").style.display = "none";
} else {
  let itensHtml = "<ul>";
  carrinho.forEach((item) => {
    const qtd = item.quantity || 1;
    itensHtml += "<li>" + qtd + "x " + item.title + "</li>";
  });
  itensHtml += "</ul>";

  resumoDiv.innerHTML =
    "<h3>Itens do Pedido:</h3>" +
    itensHtml +
    "<h3>Total do Pedido: <span class='valor-total'>R$ " + total.toFixed(2) + "</span></h3>";
}

// ===== ENTREGA x MESA =====
const tipoSelect = document.getElementById("tipo-pedido");
const campoEndereco = document.getElementById("campo-endereco");
const campoMesa = document.getElementById("campo-mesa");

function atualizarCampos() {
  const ehEntrega = tipoSelect.value === "entrega";
  campoEndereco.style.display = ehEntrega ? "block" : "none";  // some se for mesa
  campoMesa.style.display = ehEntrega ? "none" : "block";      // aparece se for mesa
}

tipoSelect.addEventListener("change", atualizarCampos);
atualizarCampos(); // ajusta já quando a página abre

// ===== VALIDAÇÃO =====
function mostrarErro(campo, mensagem) {
  document.getElementById("erro-" + campo).textContent = mensagem;
}

function limparErros() {
  document.querySelectorAll(".erro").forEach((e) => (e.textContent = ""));
}

function validarFormulario() {
  let valido = true;

  const nome = document.getElementById("nome").value.trim();
  if (nome.length < 3) {
    mostrarErro("nome", "Informe seu nome (mínimo de 3 letras).");
    valido = false;
  }

    if (tipoSelect.value === "entrega") {
    const rua = document.getElementById("rua").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const bairro = document.getElementById("bairro").value.trim();

    if (rua.length < 3) {
      mostrarErro("rua", "Informe o nome da rua.");
      valido = false;
    }

    // número: só dígitos (com letra opcional, ex.: 120A) ou "s/n"
    if (!/^\d+[a-zA-Z]?$/.test(numero) && numero.toLowerCase() !== "s/n") {
      mostrarErro("numero", "Informe o número (ex.: 120, 45B ou s/n).");
      valido = false;
    }

    if (bairro.length < 3) {
      mostrarErro("bairro", "Informe o bairro.");
      valido = false;
    }
  
  } else {
    const mesa = Number(document.getElementById("mesa").value);
    if (!Number.isInteger(mesa) || mesa < 1) {
      mostrarErro("mesa", "Informe um número de mesa válido (1 ou mais).");
      valido = false;
    }
  }

  if (document.getElementById("pagamento").value === "") {
    mostrarErro("pagamento", "Escolha um método de pagamento.");
    valido = false;
  }

  return valido;
}

// ===== ENVIO =====
document.getElementById("checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();
  limparErros();

  if (!validarFormulario()) {
    return; // tem erro: não finaliza
  }

  const nome = document.getElementById("nome").value.trim();
  alert("Obrigado pelo pedido, " + nome + "! Seu pedido foi finalizado com sucesso e já está sendo preparado. ☕");

  localStorage.removeItem("cart");
  window.location.href = "index.html";
});