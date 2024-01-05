using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CadastroDeProdutoApi.Models;

namespace CadastroDeProdutoApi.Controllers
{
    public class ProdutosController : Controller
    {
        private readonly Contexto _context;

        public ProdutosController(Contexto context)
        {
            _context = context;
        }

        public async Task<JsonResult> BuscarTodos()
        {
            if (_context.Produto != null)
            {
                var produtos = await _context.Produto.ToListAsync();
                return Json(produtos);
            }
            else
            {
                return Json(new { error = "Entity set 'Contexto.Produto' is null." });
            }
        }


        // [HttpGet]
        // public async Task<JsonResult> BuscarTodos(int? page, int? pageSize)//paginação
        // {
        //     try
        //     {
        //         // Defina valores padrão se nenhum valor for fornecido
        //         int currentPage = page ?? 1;
        //         int itemsPerPage = pageSize ?? 500;

        //         var totalItems = await _context.Produto.CountAsync();
        //         var totalPages = (int)Math.Ceiling((double)totalItems / itemsPerPage);

        //         var produtos = await _context.Produto
        //             .Skip((currentPage - 1) * itemsPerPage)
        //             .Take(itemsPerPage)
        //             .ToListAsync();

        //         var paginationHeader = new
        //         {
        //             TotalItems = totalItems,
        //             TotalPages = totalPages,
        //             CurrentPage = currentPage,
        //             PageSize = itemsPerPage
        //         };

        //         Response.Headers.Add("X-Pagination", Newtonsoft.Json.JsonConvert.SerializeObject(paginationHeader));

        //         return Json(produtos);
        //     }
        //     catch (Exception ex)
        //     {
        //         return Json(new { error = ex.Message });
        //     }
        // }

        public async Task<JsonResult> BuscarUm(int? id)
        {
            if (id == null || _context.Produto == null)
            {
                return Json(new { error = "Not Found" });
            }

            var produto = await _context.Produto.FirstOrDefaultAsync(m => m.Id == id);
            if (produto == null)
            {
                return Json(new { error = "Not Found" });
            }

            return Json(produto);
        }

        [HttpPost]
        public async Task<JsonResult> Gravar([FromBody] Produto produto)
        {
            if (ModelState.IsValid)
            {
                _context.Add(produto);
                await _context.SaveChangesAsync();
                return Json(produto);
            }
            else
            {
                return Json(new { error = "Invalid model data" });
            }
        }

        [HttpPost]
        public async Task<JsonResult> Alterar(int id, [FromBody] Produto produto)
        {
            if (id != produto.Id)
            {
                return Json(new { error = "Invalid ID" });
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(produto);
                    await _context.SaveChangesAsync();
                    return Json(new { message = "Usuario updated successfully" });
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ProdutoExists(produto.Id))
                    {
                        return Json(new { error = "Usuario not found" });
                    }
                    else
                    {
                        return Json(new { error = "Concurrency exception" });
                    }
                }
            }
            else
            {
                return Json(new { error = "Invalid model data" });
            }
        }


        [HttpPost]
        public async Task<JsonResult> Deletar(int id)
        {
            if (_context.Produto == null)
            {
                return Json(new { error = "Entity set 'Contexto.Produto' is null." });
            }

            var produto = await _context.Produto.FindAsync(id);
            if (produto != null)
            {
                _context.Produto.Remove(produto);
                await _context.SaveChangesAsync();
                return Json(new { message = "Produto removido com sucesso." });
            }
            else
            {
                return Json(new { error = "Produto não encontrado." });
            }
        }

        private bool ProdutoExists(int id)
        {
            return (_context.Produto?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
