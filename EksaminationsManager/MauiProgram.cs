using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using CommunityToolkit.Maui;
using EksaminationsManager.Data;
using EksaminationsManager.Services;
using EksaminationsManager.ViewModels;
using EksaminationsManager.Views;
using EksaminationsManager.Converters;

namespace EksaminationsManager;

public static class MauiProgram
{
	public static MauiApp CreateMauiApp()
	{
		var builder = MauiApp.CreateBuilder();
		builder
			.UseMauiApp<App>()
			.UseMauiCommunityToolkit()
			.ConfigureFonts(fonts =>
			{
				fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
				fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
			});

		// Register database with SQLite
		var dbPath = Path.Combine(FileSystem.AppDataDirectory, "examinations.db");
		builder.Services.AddDbContext<ExaminationDbContext>(options =>
			options.UseSqlite($"Data Source={dbPath}"));

		// Register services
		builder.Services.AddScoped<IExaminationService, ExaminationService>();
		builder.Services.AddScoped<DatabaseService>();

		// Register ViewModels
		builder.Services.AddTransient<MainViewModel>();
		builder.Services.AddTransient<CreateExamViewModel>();
		builder.Services.AddTransient<ExamsListViewModel>();
		builder.Services.AddTransient<AddStudentsViewModel>();
		builder.Services.AddTransient<ExamSessionViewModel>();
		builder.Services.AddTransient<HistoryViewModel>();
		builder.Services.AddTransient<ExamDetailsViewModel>();

		// Register Views with their ViewModels
		builder.Services.AddTransient<MainPage>();
		builder.Services.AddTransient<CreateExamPage>();
		builder.Services.AddTransient<ExamsListPage>();
		builder.Services.AddTransient<AddStudentsPage>();
		builder.Services.AddTransient<ExamSessionPage>();
		builder.Services.AddTransient<HistoryPage>();
		builder.Services.AddTransient<ExamDetailsModal>();

		// Register converters
		builder.Services.AddSingleton<EqualToZeroConverter>();
		builder.Services.AddSingleton<StringToBoolConverter>();
		builder.Services.AddSingleton<GradeToColorConverter>();

#if DEBUG
		builder.Logging.AddDebug();
#endif

		return builder.Build();
	}
}
