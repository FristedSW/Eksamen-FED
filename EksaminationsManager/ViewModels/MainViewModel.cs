using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using EksaminationsManager.Services;
using EksaminationsManager.Views;

namespace EksaminationsManager.ViewModels;

public partial class MainViewModel : BaseViewModel
{
    private readonly IExaminationService _examinationService;
    
    public MainViewModel(IExaminationService examinationService)
    {
        _examinationService = examinationService;
        Title = "Examination Manager";
        System.Diagnostics.Debug.WriteLine("MainViewModel created");
    }
    
    [RelayCommand]
    private async Task CreateExamAsync()
    {
        System.Diagnostics.Debug.WriteLine("CreateExam command executed");
        try
        {
            await Shell.Current.GoToAsync(nameof(CreateExamPage));
            System.Diagnostics.Debug.WriteLine("Navigation to CreateExamPage completed");
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Navigation failed: {ex.Message}");
            await Shell.Current.DisplayAlert("Navigation Error", ex.Message, "OK");
        }
    }
    
    [RelayCommand]
    private async Task ViewExamsAsync()
    {
        System.Diagnostics.Debug.WriteLine("ViewExams command executed");
        try
        {
            await Shell.Current.GoToAsync(nameof(ExamsListPage));
            System.Diagnostics.Debug.WriteLine("Navigation to ExamsListPage completed");
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Navigation failed: {ex.Message}");
            await Shell.Current.DisplayAlert("Navigation Error", ex.Message, "OK");
        }
    }
    
    [RelayCommand]
    private async Task ViewHistoryAsync()
    {
        System.Diagnostics.Debug.WriteLine("ViewHistory command executed");
        try
        {
            await Shell.Current.GoToAsync(nameof(HistoryPage));
            System.Diagnostics.Debug.WriteLine("Navigation to HistoryPage completed");
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Navigation failed: {ex.Message}");
            await Shell.Current.DisplayAlert("Navigation Error", ex.Message, "OK");
        }
    }
} 