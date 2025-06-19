using EksaminationsManager.ViewModels;

namespace EksaminationsManager.Views;

public partial class ExamsListPage : ContentPage
{
    public ExamsListPage(ExamsListViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
    
    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await ((ExamsListViewModel)BindingContext).LoadExamsCommand.ExecuteAsync(null);
    }
} 