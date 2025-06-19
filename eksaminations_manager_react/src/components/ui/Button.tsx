import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
	size?: 'sm' | 'md' | 'lg';
	children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
	variant = 'primary',
	size = 'md',
	className = '',
	children,
	...props
}) => {
	const baseClasses = 'font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
	
	const variantClasses = {
		primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
		secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500',
		success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
		danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
		warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
	};

	const sizeClasses = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base',
	};

	const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

	return (
		<button className={classes} {...props}>
			{children}
		</button>
	);
}; 