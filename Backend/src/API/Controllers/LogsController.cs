using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace FinanceTracker.src.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogsController : ControllerBase
    {
        private readonly string _logPath;

        public LogsController()
        {
            _logPath = Path.Combine(Directory.GetCurrentDirectory(), "log.txt");
        }

        [HttpPost]
        public IActionResult WriteLog([FromBody] LogEntry entry)
        {
            try
            {
                var logMessage = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] {entry.Message}";
                if (!string.IsNullOrEmpty(entry.Data))
                {
                    logMessage += $" | DATA: {entry.Data}";
                }
                logMessage += "\n";

                System.IO.File.AppendAllText(_logPath, logMessage);
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        [HttpDelete]
        public IActionResult ClearLog()
        {
            try
            {
                if (System.IO.File.Exists(_logPath))
                {
                    System.IO.File.Delete(_logPath);
                }
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        [HttpGet]
        public IActionResult GetLog()
        {
            try
            {
                if (!System.IO.File.Exists(_logPath))
                {
                    return Ok(new { content = "Лог пуст" });
                }
                var content = System.IO.File.ReadAllText(_logPath);
                return Ok(new { content });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }
    }

    public class LogEntry
    {
        public string Message { get; set; } = "";
        public string? Data { get; set; }
    }
}