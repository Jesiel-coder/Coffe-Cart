// ===== PREPARA A PÁGINA =====
const root = document.getElementById("root");
root.className = "container pb-5";
criarCabecalho();

const FORMAS_PAGAMENTO = ["Pix", "Cartão de crédito/débito", "Boleto", "Dinheiro"];

// ===== CAMPOS DO FORMULÁRIO =====
// cada função devolve { grupo, input, erro } para podermos usar depois

function criarCampo(id, rotulo, tipo, placeholder) {
  const grupo = document.createElement("div");
  grupo.className = "mb-3";

  const label = document.createElement("label");
  label.className = "form-label fw-semibold";
  label.htmlFor = id;
  label.textContent = rotulo;

  const input = document.createElement("input");
  input.type = tipo;
  input.id = id;
  input.className = "form-control";
  if (placeholder) input.placeholder = placeholder;

  // o Bootstrap mostra esta div quando o input tem a classe "is-invalid"
  const erro = document.createElement("div");
  erro.className = "invalid-feedback";

  grupo.append(label, input, erro);
  return { grupo, input, erro };
}

function criarSelect(id, rotulo, opcoes) {
  const grupo = document.createElement("div");
  grupo.className = "mb-3";

  const label = document.createElement("label");
  label.className = "form-label fw-semibold";
  label.htmlFor = id;
  label.textContent = rotulo;

  const input = document.createElement("select");
  input.id = id;
  input.className = "form-select";

  for (const [valor, texto] of opcoes) {
    const opcao = document.createElement("option");
    opcao.value = valor;
    opcao.textContent = texto;
    input.appendChild(opcao);
  }

  const erro = document.createElement("div");
  erro.className = "invalid-feedback";

  grupo.append(label, input, erro);
  return { grupo, input, erro };
}

function marcarErro(campo, mensagem) {
  campo.input.classList.add("is-invalid");
  campo.erro.textContent = mensagem;
}

function limparErro(campo) {
  campo.input.classList.remove("is-invalid");
  campo.erro.textContent = "";
}

// ===== RESUMO DO PEDIDO (itens + total) =====
function criarResumo(itens, total) {
  const card = document.createElement("div");
  card.className = "card shadow-sm mb-4";

  const lista = document.createElement("ul");
  lista.className = "list-group list-group-flush";

  for (const item of itens) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";

    const nome = document.createElement("span");
    nome.textContent = item.quantity + "x " + item.title;

    const subtotal = document.createElement("span");
    subtotal.textContent = formatarPreco(item.price * item.quantity);

    li.append(nome, subtotal);
    lista.appendChild(li);
  }

  const linhaTotal = document.createElement("li");
  linhaTotal.className = "list-group-item d-flex justify-content-between fw-bold";

  const rotuloTotal = document.createElement("span");
  rotuloTotal.textContent = "Total do pedido";

  const valorTotal = document.createElement("span");
  valorTotal.className = "text-success";
  valorTotal.textContent = formatarPreco(total);

  linhaTotal.append(rotuloTotal, valorTotal);
  lista.appendChild(linhaTotal);

  card.appendChild(lista);
  return card;
}

// ===== FORMULÁRIO =====
function criarFormulario(itens, total) {
  const form = document.createElement("form");
  form.noValidate = true;   // as mensagens são as nossas, não as do navegador
  form.className = "card card-body shadow-sm";

  const nome = criarCampo("nome", "Nome completo", "text");
  const tipo = criarSelect("tipo-pedido", "Como você quer receber?", [
    ["entrega", "Entrega"],
    ["mesa", "Mesa"],
  ]);

  // endereço de entrega (4 campos dentro de um bloco só)
  const rua = criarCampo("rua", "Rua", "text", "Ex.: Rua das Flores");
  const numero = criarCampo("numero", "Número da casa", "text", "Ex.: 120, 45B ou s/n");
  const complemento = criarCampo("complemento", "Complemento (opcional)", "text", "Apto, bloco, ponto de referência");
  const bairro = criarCampo("bairro", "Bairro", "text");

  const blocoEndereco = document.createElement("div");
  blocoEndereco.append(rua.grupo, numero.grupo, complemento.grupo, bairro.grupo);

  const mesa = criarCampo("mesa", "Número da mesa", "number", "Ex.: 5");
  mesa.input.min = 1;

  const opcoesPagamento = [["", "Selecione..."]];
  for (const forma of FORMAS_PAGAMENTO) {
    opcoesPagamento.push([forma, forma]);
  }
  const pagamento = criarSelect("pagamento", "Forma de pagamento", opcoesPagamento);

  const btnFinalizar = document.createElement("button");
  btnFinalizar.type = "submit";
  btnFinalizar.className = "btn btn-success w-100 mt-2";
  btnFinalizar.textContent = "Confirmar e Finalizar";

  form.append(nome.grupo, tipo.grupo, blocoEndereco, mesa.grupo, pagamento.grupo, btnFinalizar);

  // ----- mostra endereço OU mesa, conforme a escolha -----
  function atualizarCampos() {
    const ehEntrega = tipo.input.value === "entrega";
    blocoEndereco.classList.toggle("d-none", !ehEntrega);
    mesa.grupo.classList.toggle("d-none", ehEntrega);
  }
  tipo.input.addEventListener("change", atualizarCampos);
  atualizarCampos();

  // ----- validação: devolve true se estiver tudo certo -----
  function validar() {
    let valido = true;

    for (const campo of [nome, rua, numero, bairro, mesa, pagamento]) {
      limparErro(campo);
    }

    if (nome.input.value.trim().length < 3) {
      marcarErro(nome, "Informe seu nome (mínimo de 3 letras).");
      valido = false;
    }

    if (tipo.input.value === "entrega") {
      if (rua.input.value.trim().length < 3) {
        marcarErro(rua, "Informe o nome da rua.");
        valido = false;
      }

      // número: dígitos (com letra opcional, ex.: 120A) ou "s/n"
      const num = numero.input.value.trim();
      if (!/^\d+[a-zA-Z]?$/.test(num) && num.toLowerCase() !== "s/n") {
        marcarErro(numero, "Informe o número (ex.: 120, 45B ou s/n).");
        valido = false;
      }

      if (bairro.input.value.trim().length < 3) {
        marcarErro(bairro, "Informe o bairro.");
        valido = false;
      }
    } else {
      const numMesa = Number(mesa.input.value);
      if (!Number.isInteger(numMesa) || numMesa < 1) {
        marcarErro(mesa, "Informe um número de mesa válido (1 ou mais).");
        valido = false;
      }
    }

    if (pagamento.input.value === "") {
      marcarErro(pagamento, "Escolha uma forma de pagamento.");
      valido = false;
    }

    return valido;
  }

  // ----- envio -----
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validar()) {
      return;   // tem erro: não finaliza
    }

    let destino;
    if (tipo.input.value === "entrega") {
      const comp = complemento.input.value.trim();
      destino =
        rua.input.value.trim() + ", " + numero.input.value.trim() +
        (comp ? " (" + comp + ")" : "") +
        " - " + bairro.input.value.trim();
    } else {
      destino = "Mesa " + mesa.input.value;
    }

    const nomeCliente = nome.input.value.trim();
    const formaPagamento = pagamento.input.value;

    clearCart();            // limpa o localStorage
    atualizarContador();    // zera a bolinha do cabeçalho
    mostrarConfirmacao(itens, total, nomeCliente, destino, formaPagamento);
  });

  return form;
}

// ===== MENSAGEM DE CONFIRMAÇÃO (na própria página) =====
function mostrarConfirmacao(itens, total, nome, destino, formaPagamento) {
  root.innerHTML = "";

  const aviso = document.createElement("div");
  aviso.className = "alert alert-success";

  const titulo = document.createElement("h2");
  titulo.className = "h4";
  titulo.textContent = "Compra confirmada! ☕";

  const p1 = document.createElement("p");
  p1.className = "mb-1";
  p1.textContent = "Obrigado pelo pedido, " + nome + "!";

  const p2 = document.createElement("p");
  p2.className = "mb-1";
  p2.textContent = "Destino: " + destino;

  const p3 = document.createElement("p");
  p3.className = "mb-0";
  p3.textContent = "Pagamento: " + formaPagamento;

  aviso.append(titulo, p1, p2, p3);

  const voltar = document.createElement("a");
  voltar.href = "index.html";
  voltar.className = "btn btn-success";
  voltar.textContent = "Voltar ao cardápio";

  root.append(aviso, criarResumo(itens, total), voltar);
}

// ===== INÍCIO =====
// "foto" do carrinho no momento em que a página abriu
const itensDoPedido = getCart();
const totalDoPedido = getTotal();

const titulo = document.createElement("h1");
titulo.className = "h3 fw-bold text-center mb-4";
titulo.textContent = "Finalizar compra";
root.appendChild(titulo);

if (itensDoPedido.length === 0) {
  const vazio = document.createElement("div");
  vazio.className = "alert alert-info";
  vazio.textContent = "Seu carrinho está vazio. Adicione itens antes de finalizar.";

  const voltar = document.createElement("a");
  voltar.href = "index.html";
  voltar.className = "btn btn-outline-success";
  voltar.textContent = "← Voltar ao cardápio";

  root.append(vazio, voltar);
} else {
  root.append(
    criarResumo(itensDoPedido, totalDoPedido),
    criarFormulario(itensDoPedido, totalDoPedido)
  );
}
