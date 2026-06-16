using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinanceTracker.src.API.Models;
using FinanceTracker.src.Database;
using FinanceTracker.src.Security;

namespace FinanceTracker.src.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwtService;
    private readonly PasswordService _passwordService;
    private readonly ValidationService _validationService;

    public AuthController(
        AppDbContext context,
        JwtService jwtService,
        PasswordService passwordService,
        ValidationService validationService)
    {
        _context = context;
        _jwtService = jwtService;
        _passwordService = passwordService;
        _validationService = validationService;
    }

    [HttpPost("check")]
    public async Task<IActionResult> CheckUser([FromBody] CheckRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);
        
        return Ok(new { exists = user != null });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!_validationService.ValidateEmail(request.Email))
            return BadRequest(new { success = false, error = "Invalid email" });

        if (!_validationService.ValidateUsername(request.Username))
            return BadRequest(new { success = false, error = "Username must be 3-50 characters (letters, numbers, underscore)" });

        if (!_validationService.ValidatePassword(request.Password))
            return BadRequest(new { success = false, error = "Password must be at least 6 characters" });

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email || u.Username == request.Username);

        if (existingUser != null)
        {
            if (existingUser.Email == request.Email)
                return BadRequest(new { success = false, error = "Email already registered" });
            else
                return BadRequest(new { success = false, error = "Username already taken" });
        }

        var user = new User
        {
            Email = request.Email,
            Username = request.Username,
            PasswordHash = _passwordService.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = _jwtService.GenerateToken(user.Id, user.Email, user.Username);

        return Ok(new
        {
            success = true,
            token = token,
            user = new { user.Id, user.Email, user.Username }
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
            return Unauthorized(new { success = false, error = "Invalid email or password" });

        if (!_passwordService.VerifyPassword(request.Password, user.PasswordHash))
            return Unauthorized(new { success = false, error = "Invalid email or password" });

        var token = _jwtService.GenerateToken(user.Id, user.Email, user.Username);

        return Ok(new
        {
            success = true,
            token = token,
            user = new { user.Id, user.Email, user.Username }
        });
    }
}

public class CheckRequest
{
    public string Email { get; set; } = string.Empty;
}

public class RegisterRequest
{
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}