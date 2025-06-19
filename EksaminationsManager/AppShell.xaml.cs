using EksaminationsManager.Views;

namespace EksaminationsManager;

public partial class AppShell : Shell
{
	public AppShell()
	{
		InitializeComponent();
		
		// Register routes for navigation
		Routing.RegisterRoute(nameof(CreateExamPage), typeof(CreateExamPage));
		Routing.RegisterRoute(nameof(ExamsListPage), typeof(ExamsListPage));
		Routing.RegisterRoute(nameof(AddStudentsPage), typeof(AddStudentsPage));
		Routing.RegisterRoute(nameof(ExamSessionPage), typeof(ExamSessionPage));
		Routing.RegisterRoute(nameof(HistoryPage), typeof(HistoryPage));
		Routing.RegisterRoute(nameof(ExamDetailsModal), typeof(ExamDetailsModal));
	}
}
