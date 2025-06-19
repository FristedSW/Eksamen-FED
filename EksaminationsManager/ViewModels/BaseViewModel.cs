using CommunityToolkit.Mvvm.ComponentModel;

namespace EksaminationsManager.ViewModels;

public partial class BaseViewModel : ObservableObject
{
    [ObservableProperty]
    private bool _isBusy;
    
    [ObservableProperty]
    private string _title = string.Empty;
} 