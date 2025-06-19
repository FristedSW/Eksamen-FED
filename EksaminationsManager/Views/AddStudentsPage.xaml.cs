using EksaminationsManager.ViewModels;

namespace EksaminationsManager.Views;

public partial class AddStudentsPage : ContentPage
{
    public AddStudentsPage(AddStudentsViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
    
    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await ((AddStudentsViewModel)BindingContext).LoadStudentsCommand.ExecuteAsync(null);
    }
} 