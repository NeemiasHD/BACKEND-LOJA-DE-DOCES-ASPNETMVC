let filtoDeProduto;

//declarando variasveis que verificam se as opçoes de filtragem estão ativas, todas elas começam falsas, pois elas estão desligadas
let ordemAZ = false;
let ordemCategoria = false;
let ordemPreco = 0;



listarProdutos();




async function listarProdutos() { //função pra Iniciar A Listagem dos Produtos
  const data = await BuscarDados();

  if (data.length) {

    RenderPage(data);
  }
}

async function ListarOrdemAlfabetica() { // função chamada pra ligar a opção de filtro de A - Z e fazer Alterações de estilo referente ao mesmo
  if (ordemAZ) {
    ordemAZ = false;
    document.getElementById("botaoAZ").style.backgroundColor =
      "var(--CorPrincipalRosa)";
  } else {
    ordemAZ = true;
    document.getElementById("botaoAZ").style.backgroundColor =
      "var(--CorEscura)";

    for (let i = 0; i < 2; i++) {
      // tirando a cor de select do SubMenu Preço pois ele não é ultilizado quando a opção a - z está ativada.
      document.getElementById(`subEscolhap${i}`).style.backgroundColor =
        "var(--CorEscura)";
        document.getElementById(`listCategoriaP`).style.backgroundColor =
          "var(--CorPrincipalRosa)";
    }
  }

  ordemPreco = 0;// desligando o filtro de ordem de preço, pois esse filtro não é compativel o filtro de a-z
  const data = await BuscarDados();
  if (data.length > 0) {
    RenderPage(data);
  }
}

async function listarComFiltro(variavel, filtro) {
  filtoDeProduto = filtro;
  ordemCategoria = true;
  for (let i = 0; i < 6; i++) {
    document.getElementById(`subEscolha${i}`).style.backgroundColor =
      "var(--CorEscura)";
  }
  document.getElementById(`${variavel}`).style.backgroundColor =
    "var(--CorEscuraSelect)";

  const data = await BuscarDados();

  if (filtro == "todos") {
    ordemCategoria = false;
    RenderPage(data);
      document.getElementById(`listCategoriaC`).style.backgroundColor =
        "var(--CorPrincipalRosa)";
  } else {
    RenderPage(data);
      document.getElementById(`listCategoriaC`).style.backgroundColor =
        "var(--CorEscura)";
  }

}

async function listarComFiltroPreco(variavel) {
  for (let i = 0; i < 2; i++) {
    document.getElementById(`subEscolhap${i}`).style.backgroundColor =
      "var(--CorEscura)";
  }
  document.getElementById(variavel).style.backgroundColor =
    "var(--CorEscuraSelect)";

  if (variavel == "subEscolhap0") {
    ordemPreco = 1;
  } else {
    ordemPreco = 2;
  }
  const data = await BuscarDados();
  document.getElementById("botaoAZ").style.backgroundColor =
    "var(--CorPrincipalRosa)";
  RenderPage(data);

  document.getElementById(`listCategoriaP`).style.backgroundColor =
    "var(--CorEscura)";
}

document.addEventListener("DOMContentLoaded", function () {
  const BarraDePesquisa = document.querySelector(".BarraDePesquisa");

  BarraDePesquisa.addEventListener("input", async function () {
    const termoBusca = BarraDePesquisa.value.toLowerCase();
    const data = await BuscarDados();
    const produtosFiltrados = data.filter((produto) =>
      produto.nomeProduto.toLowerCase().includes(termoBusca)
    );
    RenderPage(produtosFiltrados);
  });
});

//função pra renderizar os produtos.
function RenderPage(data) {


  data = filtrarProdutos(data, ordemAZ, ordemCategoria, ordemPreco); 

  document.querySelector(".ListaDeProdutos").innerHTML = "";
  data.forEach((element) => {
    document.querySelector(
      ".ListaDeProdutos"
    ).innerHTML += `<div class="produto">
             <div class="img">
                 <img src='${element.imagem}'>
             </div>
             <p class="Informacoes">
                 <span class="tituloProduto">${element.nomeProduto}</span>
                 <span class="precoProduto">${element.preco}</span>
                 <span class="descricaoProduto">${element.descricao}</span>
                 <span class="BtnProduto">
                     <a><i class='bx bx-cart-download'></i></a>
                     <a class="InfoProduto">Info</a>
                 </span>
             </p>
         </div>`;
  });
}

async function BuscarDados(){
  const response = await fetch("https://localhost:7083/Produtos/BuscarTodos");
  let retorno = await response.json();
  return retorno;
}
