using EksaminationsManager.ViewModels;

namespace EksaminationsManager.Views;

public partial class CreateExamPage : ContentPage
{
    public CreateExamPage(CreateExamViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
} 