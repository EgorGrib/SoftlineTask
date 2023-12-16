using Domain;
using Domain.DTOs;
using Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProblemsController : ControllerBase
{
    private readonly SoftlineTaskDb _dbContext;

    public ProblemsController(SoftlineTaskDb dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Problem>>> GetProblems()
    {
        return await _dbContext.Problems.Include(p => p.Status).ToListAsync();
    }
    
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Problem>> GetProblemById(int id)
    {
        var problem = await _dbContext.Problems.Include(p => p.Status)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (problem == null)
        {
            return NotFound("Problem not found");
        }

        return problem;
    }
    
    [HttpPost]
    public async Task<IActionResult> AddProblem(ProblemDto problem)
    {
        var newProblem = new Problem(0, problem.Name, problem.Description, 1);
        await _dbContext.Problems.AddAsync(newProblem);
        await _dbContext.SaveChangesAsync();
        return Ok(newProblem);
    }
    
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateProblem(int id, UpdateProblemDto updatedProblem)
    {
        var existingProblem = await _dbContext.Problems.Include(p => p.Status)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (existingProblem == null)
        {
            return NotFound("Problem not found");
        }

        existingProblem.Name = updatedProblem.Name;
        existingProblem.Description = updatedProblem.Description;
        existingProblem.StatusId = updatedProblem.StatusId;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
    
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProblem(int id)
    {
        var task = await _dbContext.Problems.FindAsync(id);

        if (task == null)
        {
            return NotFound("Problem not found");
        }

        _dbContext.Problems.Remove(task);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}