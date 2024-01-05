let img = "";
listarProdutos();

async function listarProdutos() {
  const data = await BuscarDados();
  if (data.length > 0) {
    RenderPage(data);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  //feito pra realizar a busca só quando a pagina estiver 100% carregada senão dá erro
  const BarraDePesquisa = document.querySelector(".BarraDePesquisa");

  BarraDePesquisa.addEventListener("input", async function () {
    const termoBusca = BarraDePesquisa.value.toLowerCase();
    const data = BuscarDados();
    const produtosFiltrados = data.filter((produto) =>
      produto.nomeProduto.toLowerCase().includes(termoBusca)
    );
    RenderPage(produtosFiltrados);
  });
});

function RenderPage(data) {

  data = filtrarProdutos(data, ordemAZ, ordemCategoria, ordemPreco); 
 

  document.querySelector(".ListaDeProdutos").innerHTML = "";
  data.forEach((data) => {
    document.querySelector(
      ".ListaDeProdutos"
    ).innerHTML += `<div class="produto" id="produto${data.id}">
        ${montarProduto(data)}
      </div>
    
    `;
  });
}

async function RefreshElemen(id) {
  document.getElementById(`TodasInformacoesDoProduto${id}`).style.display =
    "flex";
  document.getElementById(`ConfirmacaoDeExclusaoDeProduto${id}`).style.display =
    "none";
  const response = await fetch(
    `https://localhost:7083/Produtos/BuscarUm/${id}`
  );
  const data = await response.json();
  document.getElementById(`produto${id}`).innerHTML = montarProduto(data);
}

async function TransformarProdutoEditavel(id) {
  const response = await fetch(
    `https://localhost:7083/Produtos/BuscarUm/${id}`
  );
  const data = await response.json();
  if (
    document.getElementById(`EditarBtn${data.id}`).style.backgroundColor ==
    "black"
  ) {
    RefreshElemen(id);
  } else {
    document.getElementById(`tituloProduto${data.id}`).value = data.nomeProduto;
    document.getElementById(`tituloProduto${data.id}`).style.pointerEvents =
      "all";
    document.getElementById(
      `CategoriaDoProdutoInput${data.id}`
    ).style.pointerEvents = "all";
    document.getElementById(`CategoriaDoProdutoInput${data.id}`).style.color =
      "black";

    document.getElementById(`precoProduto${data.id}`).value = data.preco;
    document.getElementById(`precoProduto${data.id}`).style.pointerEvents =
      "all";

    document.getElementById(`descricaoProduto${data.id}`).value =
      data.descricao;
    document.getElementById(`descricaoProduto${data.id}`).style.pointerEvents =
      "all";

    document.getElementById(`EditarBtn${data.id}`).style.backgroundColor =
      "black";

    document.getElementById(`ImagemPhoto${id}`).style.opacity = "1";

    document.getElementById(`ImagemInputLb${id}`).style.pointerEvents = "all";
  }
}

async function confirmarExclusaoDeProduto(id) {
  document.getElementById(`TodasInformacoesDoProduto${id}`).style.display =
    "none";
  document.getElementById(`ConfirmacaoDeExclusaoDeProduto${id}`).style.display =
    "flex";
}

async function ExcluirProduto(id) {
  document.getElementById(
    `ConfirmacaoDeExclusaoDeProduto${id}`
  ).innerHTML = `<span class="loader2"></span>;`;

  const response = await fetch(
    `https://localhost:7083/Produtos/Deletar/${id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  if (data.error) {
    alert(data.error);
  } else {
    listarProdutos(); //remontar a pagina
    //location.reload(); //Recarregando pagina
  }
}

async function alterarProduto(id) {
  const produtoAntigo = await BuscarUmProduto(id);

  let NomeProduto = document.getElementById(
    `tituloProduto${produtoAntigo.id}`
  ).value;
  let Descricao = document.getElementById(
    `descricaoProduto${produtoAntigo.id}`
  ).value;
  let preco = document.getElementById(`precoProduto${produtoAntigo.id}`).value;

  let Categoria = document.getElementById(
    `CategoriaDoProdutoInput${produtoAntigo.id}`
  ).value;

  if (NomeProduto == null || NomeProduto == "") {
    NomeProduto = produtoAntigo.nomeProduto;
  }
  if (Descricao == null || Descricao == "") {
    Descricao = produtoAntigo.descricao;
  }
  if (preco == null || preco == "") {
    preco = produtoAntigo.preco;
  }
  if (img == "" || img == null) {
    img = produtoAntigo.imagem;
  }

  const dados = {
    id: id,
    nomeProduto: NomeProduto,
    descricao: Descricao,
    categoria: Categoria,
    imagem: img,
    preco: preco,
  };
  const Response = await fetch(
    `https://localhost:7083/Produtos/Alterar/${id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    }
  );
  const data = await Response.json();
  if (data.error) {
    alert("ERRO");
  } else {
    img = "";
    RefreshElemen(id);
  }
}

async function BuscarUmProduto(id) {
  const response = await fetch(
    `https://localhost:7083/Produtos/BuscarUm/${id}`
  );
  const data = await response.json();
  return data;
}

function AlterarImagem(id) {
  const ImagemPreview = document.getElementById(`ImagemPreview${id}`);
  const ImagemInput = document.getElementById(`ImagemInput${id}`);
  function recortarImagemQuadrada(imagem, larguraDesejada) {
    var canvas = document.createElement("canvas");

    var ctx = canvas.getContext("2d");

    var tamanho = Math.min(imagem.width, imagem.height);

    canvas.width = larguraDesejada;
    canvas.height = larguraDesejada;

    var offsetX = (imagem.width - tamanho) / 2;
    var offsetY = (imagem.height - tamanho) / 2;

    ctx.drawImage(
      imagem,
      offsetX,
      offsetY,
      tamanho,
      tamanho,
      0,
      0,
      larguraDesejada,
      larguraDesejada
    );

    var imagemRecortada = new Image();
    imagemRecortada.src = canvas.toDataURL("image/png");

    return imagemRecortada;
  }

  ImagemPreview.src = "";

  const file = ImagemInput.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const imagemOriginal = new Image();
      imagemOriginal.src = e.target.result;
      imagemOriginal.onload = function () {
        // Agora, dentro desta função de retorno, você pode recortar a imagem e definir a visualização
        ImagemPreview.src = recortarImagemQuadrada(imagemOriginal, 200).src;
        img = ImagemPreview.src;
      };
    };

    reader.readAsDataURL(file);
  } else {
    document.querySelector(".bx.bx-image-add").style.display = "flex";
  }
}


function montarProduto(data) {
  return `
        <div class="TodasInformacoesDoProduto" id="TodasInformacoesDoProduto${data.id}">

             <div class="img">
                 <img src='${data.imagem}'>
                 <i class='bx bxs-image-add' id="ImagemPhoto${data.id}"></i>

                 <input type="file" id="ImagemInput${data.id}" accept="image/*" onchange="AlterarImagem(${data.id})" style="display: none;">
                  <label for="ImagemInput${data.id}" class="ImagemInput" id="ImagemInputLb${data.id}">
                      <i class='bx bx-image-add'></i>
                      <img src="" class="ImagemPreview" id="ImagemPreview${data.id}">
                  </label>



             </div>
             <p class="Informacoes">
                 <Input class="tituloProduto" id="tituloProduto${data.id}"  placeholder="${data.nomeProduto}">
                 <select class="CategoriaDoProdutoInput" id="CategoriaDoProdutoInput${data.id}" name="itens">
                    <option value="${data.categoria}" selected>${data.categoria}</option>
                    <option value="Almoço">Almoço</option>
                    <option value="Lanche">Lanche</option>
                    <option value="Sobremesa">Sobremesa</option>
                    <option value="Sorvete">Sorvete</option>
                    <option value="Açai">Açai</option>
                 </select>
                 <Input class="precoProduto" id="precoProduto${data.id}" placeholder="${data.preco}">
                 <Input class="descricaoProduto" id="descricaoProduto${data.id}" placeholder="${data.descricao}">
                
                 <span class="BtnProduto">
                     <a class="EditarBtn" id="EditarBtn${data.id}" onclick="TransformarProdutoEditavel(${data.id})"><i class='bx bxs-edit-alt'></i></a>
                     <a class="LixoBtn" onclick="confirmarExclusaoDeProduto(${data.id})"><i class='bx bxs-trash' ></i></a>
                     <a class="SalvarBtn" onclick="alterarProduto(${data.id})"><i class='bx bxs-save' ></i></a>
                     <a class="DuplicarBtn" onclick="Duplicate(${data.id})" style= "background-color: var(--botaoDuplicar)"><i class='bx bxs-duplicate'></i></a>
                 </span>
             </p>
         </div>
         <div class="ConfirmacaoDeExclusaoDeProduto" id="ConfirmacaoDeExclusaoDeProduto${data.id}">
                <h1>Tem Certeza que deseja Excluir Este Produto?</h1>
                <div class="SimOuNaoBtn">  
                  <a class="ExcluirSimBTN" onclick="ExcluirProduto(${data.id})">Sim</a>
                  <a class="ExcluirNaoBTN" onclick="RefreshElemen(${data.id})">não</a>
          </div>
        </div>
    
    `;
}

async function Duplicate(id) {
  const response = await fetch(
    `https://localhost:7083/Produtos/BuscarUm/${id}`
  );
  const data = await response.json();

  const dados = {
    NomeProduto: data.nomeProduto,
    Categoria: data.categoria,
    imagem: data.imagem,
    Descricao: data.descricao,
    preco: data.preco,
  };
  const response2 = await fetch(`https://localhost:7083/Produtos/Gravar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
  const data2 = await response2.json();
  if (data2.error) {
    alert("Não foi gravado");
  } else {
    listarProdutos();
  }
}

//Filtros de Listagem

let filtoDeProduto;

//declarando variasveis que verificam se as opçoes de filtragem estão ativas, todas elas começam falsas, pois elas estão desligadas
let ordemAZ = false;
let ordemCategoria = false;
let ordemPreco = 0;

async function ListarOrdemAlfabetica() {
  // função chamada pra ligar a opção de filtro de A - Z e fazer Alterações de estilo referente ao mesmo
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

  ordemPreco = 0; // desligando o filtro de ordem de preço, pois esse filtro não é compativel o filtro de a-z
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






async function BuscarDados() {
  const response = await fetch("https://localhost:7083/Produtos/BuscarTodos");
  let retorno = await response.json();
  return retorno;
}
