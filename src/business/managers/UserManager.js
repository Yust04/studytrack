import { auth, loginWithGoogle, logout } from "../../firebase";

export const UserManager = {
  login: loginWithGoogle,
  logout,
  onAuth(cb) {
    return auth.onAuthStateChanged(cb);
  }
};
