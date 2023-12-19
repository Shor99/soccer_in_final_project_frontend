import axios from "axios";

const baseUrl = "http://localhost:8080/api/v1";

export const register = (username: string, email: string, password: string) => {
  return axios.post(`${baseUrl}/auth/signup`, { username, email, password });
};
export const userDetSet = (username: String) => {
  return axios.get(`${baseUrl}/users/${username}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }).then((res) => {
    const userId = res.data.id;
    const email = res.data.email
    localStorage.setItem("userId", userId);
    localStorage.setItem("email", email);
    admin();
  }
  )
}
export const getProfileLogo = (username: String) => {
  return axios.get(`${baseUrl}/users/${username}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }).then((res) => {
    const profileLogo = res.data.profileLogoUrl;
    localStorage.setItem(String(username), profileLogo);
  }
  )
}
export const updateUser = (username: String, email: String, profileLogoUrl: String) => {
  return axios.put(`${baseUrl}/users/${username}`, { username, email, profileLogoUrl }, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }).then((res) => {
    const profileLogo = res.data.profileLogoUrl;
    const username = res.data.username;
    const email = res.data.email;
    localStorage.setItem(String(username), profileLogo);
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
  }
  )
}
export const admin = () => {
  return axios.get(`${baseUrl}/users/${localStorage.getItem("userId")}/roles`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }).then((res) => {
    const role = String(res.data[0].id);
    role === "2" ? localStorage.setItem("role", "Admin") : localStorage.setItem("role", "User");
  }
  )
}
export const login = (username: string, password: string) => {
  return axios.post(`${baseUrl}/auth/signin`, { username, password }).then((res) => {
    //logic what do we want to do with the token:
    //axios body: res.data.
    const token = res.data.jwt;
    if (token) {
      localStorage.setItem("user", JSON.stringify({ token, username }));
      localStorage.setItem("token", token);
    }
    localStorage.setItem("username", username);
    userDetSet(username);
    localStorage.setItem("transfer_page_number", "0");
    localStorage.setItem("searching_transfer", "false");
    return res;
  }
  )
};
export const logout = () => {
  //forget the user
  localStorage.removeItem("user");
  localStorage.removeItem("userId");
};


const authService = { register, login, logout, userDetSet, admin, getProfileLogo, updateUser }
export default authService;