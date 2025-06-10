import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Auth Provider
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRouteProtection from "@/components/PublicRouteProtection";

// Contexts
import { TicketCartProvider } from "@/contexts/TicketCartContext";

//pagamento
import PixCheckoutPage from "./pages/checkout/PixCheckoutPage";
import CardCheckoutPage from "./pages/checkout/CardCheckoutPage";

// Pages
import Index from "./pages/Index";
import ValidateTicket from "./pages/ValidateTicket";
import BuyTicket from "./pages/portal/buyer/BuyTicket";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "@/pages/auth/SignUpPage";
import Unauthorized from "./pages/Unauthorized";
import Merchandise from "./pages/Merchandise";
import EventDetails from "./pages/EventDetails";
import Events from "./pages/Events";



//import MerchandiseDetails from "./pages/MerchandiseDetails";
import Cart from "./pages/Cart";
import FavoriteEvents from "./pages/FavoriteEvents";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import MyTickets from "./pages/portal/buyer/MyTickets";

// Dashboards
import Overview from "./pages/portal/admin/PortalAdmin";
import ColaboradorDashboard from "./pages/portal/scanner/portalScanner";
import UserProfile from "./pages/UserProfile";

const queryClient = new QueryClient();

// Redireciona com base no papel do usuário
const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case "gerente":
      return <Navigate to="/admin" />;
    case "colaborador":
      return <Navigate to="/colaborador" />;
    case "participante":
      return <Navigate to="/" />;
    default:
      return <Navigate to="/" />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <TicketCartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rotas públicas */}
              <Route
                path="/"
                element={
                  <PublicRouteProtection>
                    <Index />
                  </PublicRouteProtection>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRouteProtection>
                    <Login />
                  </PublicRouteProtection>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRouteProtection>
                    <Signup />
                  </PublicRouteProtection>
                }
              />

              <Route
                path="/eventos"
                element={
                  <PublicRouteProtection>
                    <Events />
                  </PublicRouteProtection>
                }
              />
              <Route
                path="/evento/:id"
                element={
                  <PublicRouteProtection>
                    <EventDetails />
                  </PublicRouteProtection>
                }
              />

              <Route
                path="/comprar"
                element={
                  <PublicRouteProtection>
                    <BuyTicket />
                  </PublicRouteProtection>
                }
              />
              <Route
                path="/comprar/:eventId"
                element={
                  <PublicRouteProtection>
                    <BuyTicket />
                  </PublicRouteProtection>
                }
              />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Favoritos */}
              <Route
                path="/favoritos"
                element={
                  <PublicRouteProtection>
                    <FavoriteEvents />
                  </PublicRouteProtection>
                }
              />

              {/* Loja */}
              <Route
                path="/loja"
                element={
                  <PublicRouteProtection>
                    <Merchandise />
                  </PublicRouteProtection>
                }
              />
              <Route
                path="/carrinho"
                element={
                  <PublicRouteProtection>
                    <Cart />
                  </PublicRouteProtection>
                }
              />

              {/* Checkout */}
              <Route
                path="/checkout"
                element={
                  <PublicRouteProtection>
                    <CheckoutPage />
                  </PublicRouteProtection>
                }
              />

              {/* Portal do participante */}
              <Route
                path="/meus-ingressos"
                element={
                  <ProtectedRoute allowedRoles={["participante"]}>
                    <MyTickets />
                  </ProtectedRoute>
                }
              />

              {/* Dashboard inteligente por papel */}
              <Route path="/dashboard" element={<DashboardRouter />} />

              {/* Rotas protegidas */}
              <Route
                path="/validate"
                element={
                  <ProtectedRoute allowedRoles={["colaborador", "gerente"]}>
                    <ValidateTicket />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["gerente"]}>
                    <Overview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/colaborador"
                element={
                  <ProtectedRoute allowedRoles={["colaborador"]}>
                    <ColaboradorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout/pagamento/pix"
                element={
                  <PublicRouteProtection>
                    <PixCheckoutPage />
                  </PublicRouteProtection>
                }
              />
              <Route
                path="/checkout/pagamento/cartao"
                element={
                  <PublicRouteProtection>
                    <CardCheckoutPage />
                  </PublicRouteProtection>
                }
              />


              {/* Página 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TicketCartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
