using EksaminationsManager.ViewModels;

namespace EksaminationsManager.Views;

public partial class ExamDetailsModal : ContentPage
{
    public ExamDetailsModal(ExamDetailsViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
} 