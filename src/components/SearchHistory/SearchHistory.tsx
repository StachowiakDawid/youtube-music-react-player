import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
interface SearchHistoryComponentProps { }

const SearchHistoryComponent: FC<SearchHistoryComponentProps> = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const removeItem = (index: number) => {
    const history = getHistory();
    history.splice(index, 1);
    saveHistory(history);
    setHistory(history as never[]);
  }

  const refreshItem = (index: number) => {
    const history = getHistory();
    history[index].timestamp = Date.now();
    saveHistory(history.sort((a: any, b: any) => (
      b.timestamp - a.timestamp
    )));
  }

  const getHistory = (): any[] => {
    return JSON.parse(localStorage['searchHistory']);
  }

  const saveHistory = (history: any[]) => {
    localStorage['searchHistory'] = JSON.stringify(history);
  }

  const handleClick = (index: number, item: string) => {
    refreshItem(index);
    navigate('/search/' + item);
  }

  return <div className="container">
    <ul className="list-group list-group-flush">
      {history.map((item: any, index: number) => {
        return <li className="list-group-item d-flex justify-content-between" key={item.timestamp}>
          <span className="w-100" onClick={() => handleClick(index, item.phrase)}>{item.phrase}</span>
          <i className="bi bi-x-square-fill ml-auto h-100" onClick={() => removeItem(index)}></i>
        </li>
      })}
    </ul>
  </div>
};

export default SearchHistoryComponent;
