namespace Domain.DTOs;

public record ProblemDto(string Name, string Description);
public record UpdateProblemDto(string Name, string Description, int StatusId);