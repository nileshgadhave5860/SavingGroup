namespace BachatGatDTO.Models
{
    public class MonthDto
    {
        public int MonthId { get; set; }
        public int SGId { get; set; }
        public string MonthName { get; set; }
        public int MonthNo { get; set; }
        public int YearNo { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CreateMonthDto
    {
        public int SGId { get; set; }
       public int newMonthNo{ get; set; }
          public  int newYearNo{ get; set; }
    }

    public class CreateMonthResponseDto
    {
        public int MonthId { get; set; }
        public string MonthName { get; set; }
        public int MonthNo { get; set; }
        public int YearNo { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    public class GetLastMonthResponseDto
    {
        public int MonthId { get; set; }
        public int SGId { get; set; }
        public string MonthName { get; set; }
        public int MonthNo { get; set; }
        public int YearNo { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
    }
}
