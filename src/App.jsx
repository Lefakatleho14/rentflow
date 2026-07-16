import AppRouter from "./routes/AppRouter";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}