using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using EksaminationsManager.Models;
using EksaminationsManager.Services;
using System.Collections.ObjectModel;

namespace EksaminationsManager.ViewModels;

public partial class ExamsListViewModel : BaseViewModel
{
    private readonly IExaminationService _examinationService;
    
    [ObservableProperty]
    private ObservableCollection<Exam> _exams = new();
    
    public ExamsListViewModel(IExaminationService examinationService)
    {
        _examinationService = examinationService;
        Title = "Active Exams";
    }
    
    [RelayCommand]
    private async Task LoadExamsAsync()
    {
        if (IsBusy) return;
        
        IsBusy = true;
        
        try
        {
            System.Diagnostics.Debug.WriteLine("LoadExamsAsync - Starting to load exams");
            
            var allExams = await _examinationService.GetAllExamsAsync();
            // Only show non-completed exams
            var activeExams = allExams.Where(e => !e.IsCompleted).ToList();
            
            System.Diagnostics.Debug.WriteLine($"LoadExamsAsync - Found {allExams.Count} total exams, {activeExams.Count} active");
            
            // Clear and repopulate the ObservableCollection
            Exams.Clear();
            foreach (var exam in activeExams)
            {
                Exams.Add(exam);
            }
            
            System.Diagnostics.Debug.WriteLine($"LoadExamsAsync - Updated Exams collection with {Exams.Count} items");
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to load exams: {ex.Message}");
            if (Shell.Current != null)
            {
                await Shell.Current.DisplayAlert("Error", $"Failed to load exams: {ex.Message}", "OK");
            }
        }
        finally
        {
            IsBusy = false;
        }
    }
    
    [RelayCommand]
    private async Task AddStudentsForExamAsync(int examId)
    {
        System.Diagnostics.Debug.WriteLine($"Navigating to AddStudentsPage with ExamId: {examId}");
        
        var parameters = new Dictionary<string, object>
        {
            { "ExamId", examId }
        };
        
        await Shell.Current.GoToAsync("AddStudentsPage", parameters);
    }
    
    [RelayCommand]
    private async Task StartExamForExamAsync(int examId)
    {
        System.Diagnostics.Debug.WriteLine($"Navigating to ExamSessionPage with ExamId: {examId}");
        
        var parameters = new Dictionary<string, object>
        {
            { "ExamId", examId }
        };
        
        await Shell.Current.GoToAsync("ExamSessionPage", parameters);
    }
    
    [RelayCommand]
    private async Task GoBackAsync()
    {
        await Shell.Current.GoToAsync("..");
    }
    
    // Method to be called when page appears
    public async Task OnPageAppearing()
    {
        System.Diagnostics.Debug.WriteLine("OnPageAppearing called - loading exams");
        await LoadExamsAsync();
    }
} 