const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://elbamarketback.onrender.com/api';

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      fullName: string;
      email: string;
      phone: string;
      role: string;
      verificationTier: string;
      isAdmin: boolean;
      adminLevel?: number;
      adminPermissions?: any;
    };
    token: string;
  };
}

export const authApi = {
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: string;
  }): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },

  getMe: async (token: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return res.json();
  },
};

export { API_URL };


































// const API_URL = '${API_URL}';

// interface AuthResponse {
//   success: boolean;
//   message: string;
//   data: {
//     user: {
//       id: string;
//       firstName: string;
//       lastName: string;
//       fullName: string;
//       email: string;
//       phone: string;
//       role: string;
//       verificationTier: string;
//       isAdmin: boolean;
//       adminLevel?: number;
//       adminPermissions?: any;
//     };
//     token: string;
//   };
// }

// export const authApi = {
//   register: async (userData: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone: string;
//     password: string;
//     role: string;
//   }): Promise<AuthResponse> => {
//     const res = await fetch(`${API_URL}/auth/register`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(userData),
//     });
//     return res.json();
//   },

//   login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
//     const res = await fetch(`${API_URL}/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(credentials),
//     });
//     return res.json();
//   },

//   getMe: async (token: string): Promise<AuthResponse> => {
//     const res = await fetch(`${API_URL}/auth/me`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });
//     return res.json();
//   },
// };