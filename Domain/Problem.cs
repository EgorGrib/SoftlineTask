using System.Text.Json.Serialization;

namespace Domain;

public class Problem
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    [JsonIgnore]
    public int StatusId { get; set; }
    
    public Status Status { get; set; }

    public Problem(){}

    public Problem(int id, string name, string description, int statusId)
    {
        Id = id;
        Name = name;
        Description = description;
        StatusId = statusId;
    }
}