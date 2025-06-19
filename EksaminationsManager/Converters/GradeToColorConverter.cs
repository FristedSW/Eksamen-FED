using System.Globalization;

namespace EksaminationsManager.Converters;

public class GradeToColorConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is int grade)
        {
            return grade switch
            {
                0 or 2 => Colors.Red,
                4 or 7 => Colors.Orange,
                10 or 12 => Colors.Green,
                _ => Colors.Black
            };
        }
        return Colors.Black;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
} 