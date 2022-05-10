import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
interface SearchHistoryComponentProps { }

const SearchHistoryComponent: FC<SearchHistoryComponentProps> = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getSearchHistory();
  }, []);

  const getSearchHistory = (): Array<any> => {
    let history = JSON.parse(localStorage['searchHistory']);
    setHistory(history);
    return history;
  }
 
  const removeItem = (index: number) => {
    let history = JSON.parse(localStorage['searchHistory']);
    history.splice(index, 1);
    localStorage['searchHistory'] = JSON.stringify(history);
    setHistory(history);
  }

  const refreshItem = (index: number) => {
    let history = JSON.parse(localStorage['searchHistory']);
    history[index].timestamp = Date.now();
    history = history.sort((a: any, b: any) => {
      return b.timestamp - a.timestamp;
    });
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
