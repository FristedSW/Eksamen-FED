using EksaminationsManager.ViewModels;

namespace EksaminationsManager.Views;

public partial class ExamSessionPage : ContentPage
{
    public ExamSessionPage(ExamSessionViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
    
    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await ((ExamSessionViewModel)BindingContext).LoadExamCommand.ExecuteAsync(null);
    }
} 