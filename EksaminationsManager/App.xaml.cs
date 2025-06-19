using EksaminationsManager.Services;

namespace EksaminationsManager;

public partial class App : Application
{
	public App()
	{
		InitializeComponent();
	}
	
	protected override Window CreateWindow(IActivationState? activationState)
	{
		return new Window(new AppShell());
	}
	
	protected override async void OnStart()
	{
		base.OnStart();
		
		try
		{
			System.Diagnostics.Debug.WriteLine("App starting - initializing database...");
			
			// Initialize database
			var databaseService = IPlatformApplication.Current?.Services.GetService<DatabaseService>();
			if (databaseService != null)
			{
				await databaseService.InitializeDatabaseAsync();
				System.Diagnostics.Debug.WriteLine("Database initialized successfully");
			}
			else
			{
				System.Diagnostics.Debug.WriteLine("DatabaseService not found in DI container");
			}
		}
		catch (Exception ex)
		{
			// Handle database initialization error
			System.Diagnostics.Debug.WriteLine($"Failed to initialize database: {ex.Message}");
			System.Diagnostics.Debug.WriteLine($"Stack trace: {ex.StackTrace}");
			
			await MainThread.InvokeOnMainThreadAsync(async () =>
			{
				// Use Shell.Current instead of Application.Current.MainPage
				if (Shell.Current != null)
				{
					await Shell.Current.DisplayAlert("Database Error", 
						$"Failed to initialize database: {ex.Message}", "OK");
				}
			});
		}
	}
	
	protected override void OnResume()
	{
		base.OnResume();
		System.Diagnostics.Debug.WriteLine("App resumed");
	}
	
	protected override void OnSleep()
	{
		base.OnSleep();
		System.Diagnostics.Debug.WriteLine("App sleeping");
	}
}