using Microsoft.AspNetCore.Mvc;
using FinanceTracker.src.Models;
using FinanceTracker.src.Database;


namespace FinanceTracker.src.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _contextE;

        public CategoriesController(AppDbContext context)
        {
            _contextE = context;
        } 
        [HttpGet]
        public IActionResult GetAll()
        {
            var categories = _contextE.Categories.ToList();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var category = _contextE.Categories.Find(id);
    
            if (category == null)
            return NotFound();

            return Ok(category);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Category category)
        {
            _contextE.Categories.Add(category);
            _contextE.SaveChanges();

            return Ok(category);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Category category)
        {
            var CategoriesBe = _contextE.Categories.Find(id);

            if (CategoriesBe == null)
            return NotFound();

            CategoriesBe.Name = category.Name;
            CategoriesBe.Type = category.Type;

            _contextE.SaveChanges();

            return Ok(CategoriesBe);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var category = _contextE.Categories.Find(id);

            if (category == null)
            return NotFound();

            _contextE.Categories.Remove(category);
            _contextE.SaveChanges();

            return Ok("Удалено");
        }   
    }
}