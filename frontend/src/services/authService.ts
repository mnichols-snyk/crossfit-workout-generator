// frontend/src/services/authService.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/auth'; // Assuming your backend runs on port 3000

interface LoginResponse {
  message: string;
  token: string;
}

interface UserCredentials {
  email: string;
  password: string;
}

const login = async (credentials: UserCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    } else {
      throw new Error('An unexpected error occurred during login');
    }
  }
};

const logout = () => {
  localStorage.removeItem('userToken');
};

const getToken = (): string | null => {
  return localStorage.getItem('userToken');
};

const authService = {
  login,
  logout,
  getToken,
};

export default authService;
