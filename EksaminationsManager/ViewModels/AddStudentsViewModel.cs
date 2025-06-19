using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using EksaminationsManager.Models;
using EksaminationsManager.Services;
using System.Collections.ObjectModel;
using System.Collections.Generic;
using System.Linq;

namespace EksaminationsManager.ViewModels;

[QueryProperty(nameof(ExamId), "ExamId")]
public partial class AddStudentsViewModel : BaseViewModel
{
    private readonly IExaminationService _examinationService;
    
    [ObservableProperty]
    private int _examId;
    
    [ObservableProperty]
    private string _studentId = string.Empty;
    
    [ObservableProperty]
    private string _studentName = string.Empty;
    
    [ObservableProperty]
    private ObservableCollection<Student> _students = new();
    
    public AddStudentsViewModel(IExaminationService examinationService)
    {
        _examinationService = examinationService;
        Title = "Add Students";
    }
    
    [RelayCommand]
    private async Task LoadStudentsAsync()
    {
        if (IsBusy) return;
        
        IsBusy = true;
        
        try
        {
            var studentsList = await _examinationService.GetStudentsForExamAsync(ExamId);
            Students.Clear();
            foreach (var student in studentsList)
            {
                Students.Add(student);
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to load students: {ex.Message}");
            if (Shell.Current != null)
            {
                await Shell.Current.DisplayAlert("Error", $"Failed to load students: {ex.Message}", "OK");
            }
        }
        finally
        {
            IsBusy = false;
        }
    }
    
    [RelayCommand]
    private async Task AddStudentAsync()
    {
        if (IsBusy) return;
        
        if (string.IsNullOrWhiteSpace(StudentId) || string.IsNullOrWhiteSpace(StudentName))
        {
            if (Shell.Current != null)
            {
                await Shell.Current.DisplayAlert("Error", "Please fill in both Student ID and Name", "OK");
            }
            return;
        }
        
        IsBusy = true;
        
        try
        {
            var student = new Student
            {
                StudentId = StudentId,
                Name = StudentName
            };
            
            await _examinationService.AddStudentToExamAsync(ExamId, student);
            
            // Clear form
            StudentId = string.Empty;
            StudentName = string.Empty;
            
            // Reload students - this will update the ObservableCollection automatically
            await LoadStudentsAsync();
            
            if (Shell.Current != null)
            {
                await Shell.Current.DisplayAlert("Success", "Student added successfully!", "OK");
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to add student: {ex.Message}");
            if (Shell.Current != null)
            {
                await Shell.Current.DisplayAlert("Error", $"Failed to add student: {ex.Message}", "OK");
            }
        }
        finally
        {
            IsBusy = false;
        }
    }
    
    [RelayCommand]
    private async Task GoBackAsync()
    {
        await Shell.Current.GoToAsync("..");
    }

    partial void OnExamIdChanged(int value)
    {
        if (value > 0)
        {
            _ = LoadStudentsAsync();
        }
    }
} 