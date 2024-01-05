using CadastroDeProdutoApi.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace CadastroDeProdutoApi.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult MenuInicial()
        {
            return View();
        }

        public IActionResult ListagemDeProdutos()
        {
            return View();
        }
        public IActionResult CadastroDeProduto()
        {
            return View();
        }
        public IActionResult EdicaoDeProdutos()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}