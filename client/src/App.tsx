import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Integrations from "./pages/Integrations";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogTag from "./pages/BlogTag";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Support from "./pages/Support";
import Compliance from "./pages/Compliance";
import ComplianceAudit from "./pages/ComplianceAudit";
import ComplianceChecklist from "./pages/ComplianceChecklist";
import Trust from "./pages/Trust";
import Industries from "./pages/Industries";
import Resources from "./pages/Resources";
import ResourcesBanTheBox from "./pages/ResourcesBanTheBox";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/services"} component={Services} />
      <Route path={"/industries"} component={Industries} />
      <Route path={"/integrations"} component={Integrations} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/about"} component={About} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/tag/:tag"} component={BlogTag} />
      <Route path={"/blog/:slug"} component={BlogPost} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/support"} component={Support} />
      <Route path={"/compliance/audit"} component={ComplianceAudit} />
      <Route path={"/compliance/checklist"} component={ComplianceChecklist} />
      <Route path={"/compliance"} component={Compliance} />
      <Route path={"/trust"} component={Trust} />
      <Route path={"/resources/ban-the-box"} component={ResourcesBanTheBox} />
      <Route path={"/resources"} component={Resources} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
