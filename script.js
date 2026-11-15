// ===== CABEÇALHO (criado pelo JS) =====
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

// ----- parte nova: o resto do cabeçalho -----
const header = document.createElement("header");
header.className = "header";

const titulo = document.createElement("h1");
titulo.textContent = "Café Santa Maria";

const subtitulo = document.createElement("p");
subtitulo.textContent = "Grãos selecionados e bebidas artesanais";

const nav = document.createElement("nav");
nav.appendChild(linkCarrinho);

header.appendChild(titulo);
header.appendChild(subtitulo);
header.appendChild(nav);

// coloca o cabeçalho antes da div#root
document.getElementById("root").before(header);


async function fetchData(apiUrl) {
  try {
    // Faz a requisição à API
    const response = await fetch(apiUrl);

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error(
        `Erro na requisição: ${response.status} - ${response.statusText}`
      );
    }

    // Converte os dados para JSON
    const data = await response.json();

    // Retorna os dados obtidos
    return data;
  } catch (error) {
    // Exibe erros no console
    console.error("Erro ao buscar os dados:", error);
    throw error; // Propaga o erro para ser tratado posteriormente
  }
}

// Exemplo de uso
const host = window.location.hostname || "localhost";
const apiEndpoint = `http://${host}:3000/coffee`; // Substitua pelo URL da API desejada

fetchData(apiEndpoint)
  .then((data) => {
    console.log("Dados obtidos da API:", data);
    for (let card of data) {
      createCard(card);
    }
  })
  .catch((error) => {
    console.error("Erro durante a obtenção dos dados:", error);
  });

/*
// Dados fornecidos
const jsonData = {
  title: "Black Coffee",
  description:
    "Svart kaffe är så enkelt som det kan bli med malda kaffebönor dränkta i hett vatten, serverat varmt. Och om du vill låta fancy kan du kalla svart kaffe med sitt rätta namn: café noir.",
  ingredients: ["Coffee"],
  image:
    "https://images.unsplash.com/photo-1494314671902-399b18174975?auto=format&fit=crop&q=80&w=1887&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  id: 1,
};
*/

// Função para criar o card
function createCard(data) {
  // Seleciona a div com id "root"
  const root = document.getElementById("root");

  // Cria a div principal do card
  const card = document.createElement("div");
  card.className = "card-style";

  // Adiciona a imagem
  const image = document.createElement("img");
  image.src = data.image;
  image.alt = data.title;
  image.className = "image-style";
  card.appendChild(image);

  // Adiciona o título
  const title = document.createElement("h3");
  title.textContent = data.title;
  title.className = "title-style";
  card.appendChild(title);

  // Adiciona a descrição
  const description = document.createElement("p");
  description.textContent = data.description;
  description.className = "description-style";
  card.appendChild(description);

  // Adiciona a lista de ingredientes
  if (data.ingredients && data.ingredients.length > 0) {
    const ingredientsTitle = document.createElement("h4");
    ingredientsTitle.textContent = "Ingredients:";
    ingredientsTitle.className = "ingredients-title-style";
    card.appendChild(ingredientsTitle);

    const ingredientsList = document.createElement("ul");
    ingredientsList.className = "ingredients-list-style";

    data.ingredients.forEach((ingredient) => {
      const ingredientItem = document.createElement("li");
      ingredientItem.textContent = ingredient;
      ingredientItem.className = "ingredient-item-style";
      ingredientsList.appendChild(ingredientItem);
    });

    card.appendChild(ingredientsList);
  }
  // mostrar preço café
  if (data.price !== undefined) {
    const priceElement = document.createElement("p");
    //Formatação para preço em Reais
    priceElement.textContent = `R$ ${data.price.toFixed(2)}`;
    priceElement.className = "price-style";
    card.appendChild(priceElement);
  }
  //controle de quantidade
  let quantidade = 1;
  
  const controleQuantidade = document.createElement("div");
  controleQuantidade.style.display = "flex";
  controleQuantidade.style.alignItems = "center";
  controleQuantidade.style.gap = "12px";
  controleQuantidade.style.margin = "8px 0";

  const btnMenos = document.createElement("button");
  btnMenos.textContent = "-";
  btnMenos.style.width = "32px";

  const inputQuantidade = document.createElement("input");
  inputQuantidade.type = "number";
  inputQuantidade.min = 1;
  inputQuantidade.value = quantidade;
  inputQuantidade.className = "input-quantidade";

  // enquanto digita: se for um inteiro de 1 pra cima, guarda na variável
  inputQuantidade.addEventListener("input", () => {
    const valor = Number(inputQuantidade.value);
    if (Number.isInteger(valor) && valor >= 1) {
      quantidade = valor;
    }
  });

  // ao sair do campo: se deixou vazio ou inválido, volta pro último valor bom
  inputQuantidade.addEventListener("change", () => {
    inputQuantidade.value = quantidade;
  });

  const btnMais = document.createElement("button");
  btnMais.textContent = "+";
  btnMais.style.width = "32px";

  btnMais.addEventListener("click", () => {
    quantidade++;
    inputQuantidade.value = quantidade;
  });

  btnMenos.addEventListener("click", () => {
    if (quantidade > 1) {
      quantidade--;
      inputQuantidade.value = quantidade;
    }
    });

    controleQuantidade.appendChild(btnMenos);
    controleQuantidade.appendChild(inputQuantidade);
    controleQuantidade.appendChild(btnMais);
    
        //botão de adicionar ao carrinho
    const btnAdicionar = document.createElement("button");
    btnAdicionar.className = "btn-adicionar";
    btnAdicionar.title = "Adicionar ao carrinho"; // aparece ao passar o mouse

    const iconeAdicionar = document.createElement("img");
    iconeAdicionar.src = "imgs/adicionar.png";
    iconeAdicionar.alt = "Adicionar ao carrinho";
    iconeAdicionar.className = "icone-adicionar";

    btnAdicionar.appendChild(iconeAdicionar);

     btnAdicionar.addEventListener("click", () => {
      addItem(data, quantidade);
      atualizarContador();
    });

    const linhaAcoes = document.createElement("div");
    linhaAcoes.style.display = "flex";
    linhaAcoes.style.justifyContent = "space-between";
    linhaAcoes.style.alignItems = "center";
    linhaAcoes.style.margin = "8px 0";

    linhaAcoes.appendChild(controleQuantidade);
    linhaAcoes.appendChild(btnAdicionar);

    card.appendChild(linhaAcoes);

  // Adiciona o card à div root
  root.appendChild(card);
}

// Executa a função para criar o card
//createCard(jsonData);
