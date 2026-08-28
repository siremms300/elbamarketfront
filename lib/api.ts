// client/lib/api.ts

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://elbamarketback.onrender.com/api';

interface UserData {
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
  warehouseOperatorProfile?: any;
  farmerProfile?: any;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: UserData;
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
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        console.error('getMe failed with status:', res.status);
        return {
          success: false,
          message: 'Failed to fetch user',
          data: { user: null as any, token: '' },
        };
      }
      
      return res.json();
    } catch (error) {
      console.error('getMe network error:', error);
      return {
        success: false,
        message: 'Network error',
        data: { user: null as any, token: '' },
      };
    }
  },
};

export { API_URL };





































































// // client/lib/api.ts
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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

// export { API_URL };


















































































// // client/lib/api.ts
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://elbamarketback.onrender.com/api';

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

// export { API_URL };


































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