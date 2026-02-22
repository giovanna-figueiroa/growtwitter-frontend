import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { Feed } from "../pages/feed";
import { Login } from "../pages/login";
import { SignUp } from "../pages/sign-up";
import { Profile } from "../pages/profile";
import { Explorar } from "../pages/explorar";
import { PrivateRoute } from "../components/PrivateRoute";

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rota raiz redireciona para login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Rotas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<SignUp />} />

                {/* Rotas protegidas */}
                <Route path="/feed" element={
                    <PrivateRoute>
                        <Feed />
                    </PrivateRoute>
                } />
                <Route path="/perfil/:id" element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                } />
                <Route path="/explorar" element={
                    <PrivateRoute>
                        <Explorar />
                    </PrivateRoute>
                } />

                {/* Rota não encontrada */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}
