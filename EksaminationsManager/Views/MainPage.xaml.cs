using EksaminationsManager.ViewModels;

namespace EksaminationsManager.Views;

public partial class MainPage : ContentPage
{
    public MainPage(MainViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }

    private async void OnCreateExamClicked(object sender, EventArgs e)
    {
        await Shell.Current.GoToAsync(nameof(CreateExamPage));
    }

    private async void OnViewExamsClicked(object sender, EventArgs e)
    {
        await Shell.Current.GoToAsync(nameof(ExamsListPage));
    }

    private async void OnViewHistoryClicked(object sender, EventArgs e)
    {
        await Shell.Current.GoToAsync(nameof(HistoryPage));
    }
} 