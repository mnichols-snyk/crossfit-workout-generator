import api from './api';

const userService = {
  resetUserPassword: async (userId: number, newPassword: string) => {
    const response = await api.put(`/users/reset-password/${userId}`, { newPassword });
    return response.data;
  },
};

export default userService;
