import Story from "./components/Story";
import ErrorBoundary from "./components/ErrorBoundary";
import "./story.css";

export default function App() {
  return (
    <ErrorBoundary>
      <Story />
    </ErrorBoundary>
  );
}
