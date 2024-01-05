function filtrarProdutos(data, ordemAZ, ordemCategoria, ordemPreco) {
  if (ordemAZ) {
    const ProdutosOrdenados = data.sort((a, b) =>
      a.nomeProduto.localeCompare(b.nomeProduto)
    );
    data = ProdutosOrdenados;
  }

  if (ordemCategoria) {
    const produtoFiltrados = data.filter(
      (produto) => produto.categoria == filtoDeProduto
    );
    data = produtoFiltrados;
  }

  data.forEach((produto) => {
    produto.preco = parseFloat(produto.preco.replace(",", "."));
  });

  if (ordemPreco == 1) {
    data.sort((a, b) => a.preco - b.preco);
  } else if (ordemPreco == 2) {
    data.sort((a, b) => b.preco - a.preco);
  }

  data.forEach((produto) => {
    produto.preco = produto.preco.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    }); //fazendo ter 2 casas decimais apois a virgula

    produto.preco = "R$ " + produto.preco.replace(".", ","); //botando o simbolo de reais
  });
  return data;
}