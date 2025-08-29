
'use client';

import { useState } from 'react';
import LoginPage from '../components/LoginPage';
import Main from './Main';

export default function Page() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const handleLoginSuccess = () => {
		setIsLoggedIn(true);
	};

	if (!isLoggedIn) {
		return <LoginPage onLoginSuccess={handleLoginSuccess} />;
	}
	return <Main />;
}
