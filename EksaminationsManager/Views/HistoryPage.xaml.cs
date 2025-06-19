using EksaminationsManager.ViewModels;

namespace EksaminationsManager.Views;

public partial class HistoryPage : ContentPage
{
    public HistoryPage(HistoryViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
    
    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await ((HistoryViewModel)BindingContext).LoadExamsCommand.ExecuteAsync(null);
    }
} 