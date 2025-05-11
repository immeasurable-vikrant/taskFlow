import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="py-4 px-4 sm:px-6 flex justify-between">
        <Link to="/" className="flex items-center">
          <CheckSquare className="h-8 w-8 text-primary-600 dark:text-primary-500" />
          <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">TaskFlow</span>
        </Link>
        <button
          className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-250"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md animate-fadeIn">
          <div className="card">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
              {subtitle && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>}
            </div>
            {children}
          </div>
        </div>
      </main>
      <footer className="py-4 px-4 sm:px-6">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          TaskFlow © {new Date().getFullYear()} - Your tasks, simplified.
        </p>
      </footer>
    </div>
  );
};