import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TodoProvider } from './context/TodoContext';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
	return (
		<AuthProvider>
			<Routes>
				{/* Public routes */}
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />
        
				{/* Protected routes */}
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<TodoProvider>
								<DashboardPage />
							</TodoProvider>
						</ProtectedRoute>
					}
				/>

				{/* 404 route */}
				<Route path="/404" element={<NotFoundPage />} />
				<Route path="*" element={<Navigate to="/404" replace />} />
			</Routes>
		</AuthProvider>
	);
}

export default App;
