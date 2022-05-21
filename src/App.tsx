import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import PlayerComponent from './components/Player/Player';
import SearchBarComponent from './components/SearchBar/SearchBar';
import SearchHistoryComponent from './components/SearchHistory/SearchHistory';
import SearchResultsComponent from './components/SearchResults/SearchResults';

function App() {
  return (
    <>
      <BrowserRouter>
        <SearchBarComponent />
        <Routes>
          <Route path="/" element={<SearchHistoryComponent />} />
          <Route path="/search/:phrase" element={<SearchResultsComponent />} />
        </Routes>
        <PlayerComponent />
      </BrowserRouter>

    </>
  );
}

export default App;
