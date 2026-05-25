import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import SampleReport from "./pages/SampleReport";
import Candidates from "./pages/Candidates";
import Customers from "./pages/Customers";
import CustomerDetail from "./pages/CustomerDetail";
import ResourcesBenchmarks from "./pages/ResourcesBenchmarks";
import Integrations from "./pages/Integrations";
import Contact from "./pages/Contact";
import GetAQuote from "./pages/GetAQuote";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import Learn from "./pages/Learn";
import Subscribe from "./pages/Subscribe";
import BlogPost from "./pages/BlogPost";
import BlogTag from "./pages/BlogTag";
import BlogYear from "./pages/BlogYear";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Support from "./pages/Support";
import Compliance from "./pages/Compliance";
import ComplianceAudit from "./pages/ComplianceAudit";
import ComplianceChecklist from "./pages/ComplianceChecklist";
import Trust from "./pages/Trust";
import Industries from "./pages/Industries";
import IndustryDetail from "./pages/IndustryDetail";
import ResourcesGlossary from "./pages/ResourcesGlossary";
import ServiceInternational from "./pages/ServiceInternational";
import Resources from "./pages/Resources";
import ResourcesBanTheBox from "./pages/ResourcesBanTheBox";
import ResourcesBackgroundChecksByState from "./pages/ResourcesBackgroundChecksByState";
import ResourcesStatePage from "./pages/ResourcesStatePage";
import ResourcesMarijuanaLaws from "./pages/ResourcesMarijuanaLaws";
import ResourcesLegislativeUpdates from "./pages/ResourcesLegislativeUpdates";
import ResourcesWhitePapers from "./pages/ResourcesWhitePapers";
import ResourcesK12ComplianceGuide from "./pages/ResourcesK12ComplianceGuide";
import Spa from "./pages/Spa";
import Shrm from "./pages/Shrm";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/services"} component={Services} />
      <Route path={"/services/:slug"} component={ServiceDetail} />
      <Route path={"/sample-report"} component={SampleReport} />
      <Route path={"/candidates"} component={Candidates} />
      <Route path={"/customers"} component={Customers} />
      <Route path={"/customers/:slug"} component={CustomerDetail} />
      <Route path={"/resources/benchmarks"} component={ResourcesBenchmarks} />
      <Route path={"/industries"} component={Industries} />
      <Route path={"/industries/:slug"} component={IndustryDetail} />
      <Route path={"/resources/glossary"} component={ResourcesGlossary} />
      <Route path={"/services/international"} component={ServiceInternational} />
      <Route path={"/integrations"} component={Integrations} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/about"} component={About} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/get-a-quote"} component={GetAQuote} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/learn"} component={Learn} />
      <Route path={"/subscribe"} component={Subscribe} />
      <Route path={"/blog/tag/:tag"} component={BlogTag} />
      <Route path={"/blog/year/:year"} component={BlogYear} />
      <Route path={"/blog/:slug"} component={BlogPost} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/support"} component={Support} />
      <Route path={"/compliance/audit"} component={ComplianceAudit} />
      <Route path={"/compliance/checklist"} component={ComplianceChecklist} />
      <Route path={"/compliance"} component={Compliance} />
      <Route path={"/trust"} component={Trust} />
      <Route path={"/spa"} component={Spa} />
      <Route path={"/shrm"} component={Shrm} />
      <Route path={"/shrm-2026"} component={Shrm} />
      <Route path={"/booth"} component={Shrm} />
      <Route path={"/resources/ban-the-box"} component={ResourcesBanTheBox} />
      <Route path={"/resources/marijuana-laws"} component={ResourcesMarijuanaLaws} />
      <Route path={"/resources/legislative-updates"} component={ResourcesLegislativeUpdates} />
      <Route path={"/resources/white-papers"} component={ResourcesWhitePapers} />
      <Route path={"/resources/k12-compliance-guide"} component={ResourcesK12ComplianceGuide} />
      <Route path={"/resources/background-checks-by-state"} component={ResourcesBackgroundChecksByState} />
      <Route path={"/resources/background-checks-by-state/:slug"} component={ResourcesStatePage} />
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
