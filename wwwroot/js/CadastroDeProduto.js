const ImagemPreview = document.querySelector(".ImagemPreview");
const ImagemInput = document.getElementById("ImagemInput");
let img;
ImagemInput.addEventListener("change", function() {


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

    const file = this.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const imagemOriginal = new Image();
        imagemOriginal.src = e.target.result;
        imagemOriginal.onload = function () {
          // Agora, dentro desta função de retorno, você pode recortar a imagem e definir a visualização
        ImagemPreview.src = recortarImagemQuadrada(
            imagemOriginal,
            200
          ).src;
          document.querySelector(".bx.bx-image-add").style.display = "none";
          ImagemPreview.style.display = "flex"
          img = ImagemPreview.src;
        };
      };

      reader.readAsDataURL(file);
    }else{
      document.querySelector(".bx.bx-image-add").style.display = "flex";
    }
});


const salvarProdutoBTN = document.querySelector(".salvarProduto");
salvarProdutoBTN.addEventListener("click", async () =>{

  const NomeProduto = document.querySelector(".NomeDoProdutoInput").value;
  const Categoria = document.querySelector(".CategoriaDoProdutoInput").value;
  const Descricao = document.querySelector(".DescricaoProdutoInput").value;
  const preco = document.querySelector(".PrecoProdutoInput").value;
  const dados = {
    NomeProduto: NomeProduto,
    Categoria: Categoria,
    imagem: img,
    Descricao: Descricao,
    preco: preco
  };


  const Response = await fetch("https://localhost:7083/Produtos/Gravar",{
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
    });
    console.log(dados)
    const data = await Response.json();
    if(data.error){
      alert("Não foi gravado")
    }else{
      alert("gravado com sucesso")
    }
});