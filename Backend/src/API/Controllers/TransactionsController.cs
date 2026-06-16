using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FinanceTracker.src.Models;
using FinanceTracker.src.Database;

namespace FinanceTracker.src.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _contextE;

        public TransactionsController(AppDbContext context)
        {
            _contextE = context;
        }

        [HttpGet("user/{userId}")]
        public IActionResult GetByUser(int userId)
        {
            var transactions = _contextE.Transactions
                .Where(t => t.UserId == userId)
                .ToList();
            return Ok(transactions);
        }

        [HttpGet("user/{userId}/category/{categoryId}")]
        public IActionResult GetByCategory(int userId, int categoryId)
        {
            var transactions = _contextE.Transactions
                .Where(t => t.UserId == userId && t.CategoryId == categoryId)
                .ToList();
            return Ok(transactions);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Transaction transaction)
        {
            _contextE.Transactions.Add(transaction);
            _contextE.SaveChanges();
            return Ok(transaction);
        }

        [HttpGet("user/{userId}/balance")]
        public IActionResult GetBalance(int userId)
        {
            var transactions = _contextE.Transactions
                .Where(t => t.UserId == userId)
                .ToList();

            var income = transactions
                .Where(t => t.Type == "income")
                .Sum(t => t.Amount);

            var spending = transactions
                .Where(t => t.Type == "expense")
                .Sum(t => t.Amount);

            var balance = income - spending;
            return Ok(new { income, spending, balance });
        }

        [HttpGet("user/{userId}/expenses")]
        public IActionResult GetExpensesByMonth(int userId)
        {
            var transactions = _contextE.Transactions
                .Where(t => t.UserId == userId && t.Type == "expense")
                .ToList();

            var result = transactions
                .GroupBy(t => new { t.Date.Year, t.Date.Month })
                .Select(g => new
                {
                    Month = g.Key.Month,
                    Year = g.Key.Year,
                    Total = g.Sum(t => t.Amount)
                })
                .ToList();

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var transaction = _contextE.Transactions.Find(id);
            if (transaction == null)
                return NotFound();
            _contextE.Transactions.Remove(transaction);
            _contextE.SaveChanges();
            return Ok("Удалено");
        }
    }
}