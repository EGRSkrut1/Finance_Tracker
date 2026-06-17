using Xunit;
using System.Net.Http.Json;
using System.Net;
using FinanceTracker.src.Models;

namespace FinanceTracker.IntegrationTests.Controllers;

public class TransactionsControllerIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public TransactionsControllerIntegrationTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetByUser_ValidUserId_ReturnsOk()
    {
        var response = await _client.GetAsync("/api/transactions/user/1");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task CreateTransaction_ValidData_ReturnsOk()
    {
        var newTransaction = new Transaction
        {
            Amount = 150,
            Type = "expense",
            UserId = 1,
            CategoryId = 2,
            Description = "Тестовая транзакция",
            Date = DateTime.Now
        };

        var response = await _client.PostAsJsonAsync("/api/transactions", newTransaction);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task DeleteTransaction_NonExistentId_ReturnsNotFound()
    {
        var response = await _client.DeleteAsync("/api/transactions/99999");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}