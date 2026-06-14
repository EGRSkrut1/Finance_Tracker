namespace FinanceTracker.src.Models
{
    public class Transaction
    {
        public int Id { get; set;}   
        public double Amount { get; set;}
        public string Description { get; set;} = "";
        public DateTime Date { get; set;} = DateTime.Now;
        public string Type { get; set;} = "";




        public int CategoryId { get; set;}
        public int UserId { get; set;}
        
    }
}