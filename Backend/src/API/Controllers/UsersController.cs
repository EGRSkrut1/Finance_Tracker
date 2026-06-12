using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinanceTracker.src.API.Models;
using FinanceTracker.src.Database;
using System.Security.Claims;

namespace FinanceTracker.src.API.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("userId");
        if (userIdClaim == null)
            return Unauthorized(new { success = false, error = "Invalid token" });

        var userId = int.Parse(userIdClaim.Value);
        var user = await _context.Users
            .Where(u => u.Id == userId)
            .Select(u => new { u.Id, u.Email, u.Username, u.CreatedAt })
            .FirstOrDefaultAsync();

        if (user == null)
            return NotFound(new { success = false, error = "User not found" });

        return Ok(new { success = true, user });
    }
}