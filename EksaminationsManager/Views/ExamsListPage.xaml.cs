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
        
        System.Diagnostics.Debug.WriteLine("ExamsListPage OnAppearing called");
        
        // Load exams when page appears
        await ((ExamsListViewModel)BindingContext).OnPageAppearing();
    }
} 