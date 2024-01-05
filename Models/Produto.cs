using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CadastroDeProdutoApi.Models
{
    [Table("Produtos")]
    public class Produto
    {
        [Display(Name = "Id")]
        [Column("Id")]
        public int Id { get; set; }
        [Display(Name = "NomeProduto")]
        [Column("NomeProduto")]
        public string NomeProduto { get; set; }
        [Display(Name = "Descricao")]
        [Column("Descricao")]
        public string Descricao { get;set; }
        [Display(Name = "Categoria")]
        [Column("Categoria")]
        public string Categoria { get; set; }

        [Display(Name = "imagem")]
        [Column("imagem")]
        public string imagem { get; set; }

        [Display(Name = "preço")]
        [Column("preco")]
        public string preco { get; set; }

        



    }
}
