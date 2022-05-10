import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import { getSearchPhrase } from '../../slices/searchPhraseSlice';

interface SearchBarComponentProps { }

const SearchBarComponent: FC<SearchBarComponentProps> = () => {
  const navigate = useNavigate();
  const oldSearchPhrase: string = useAppSelector(getSearchPhrase);
  const [searchPhrase, setSearchPhrase] = useState('');

  useEffect(() => {
    setSearchPhrase(oldSearchPhrase);
  }, [oldSearchPhrase]);

  const addItemToHistory = (item: string) => {
    const history = JSON.parse(localStorage['searchHistory']);
    item = item.trim();
    const existingElement = history.find((x: any) => x.phrase === item);
    if (existingElement) {
      existingElement.timestamp = Date.now();
    } else {
      history.push({ phrase: item, timestamp: Date.now() });
    }
    saveHistory(history.sort((a: any, b: any) => (
      b.timestamp - a.timestamp
    )));
  }

  const saveHistory = (history: any[]) => {
    localStorage['searchHistory'] = JSON.stringify(history);
  }

  const clearInput = () => {
    setSearchPhrase('');
  }

  const runSearch = () => {
    if (searchPhrase.trim() === '') return;
    addItemToHistory(searchPhrase);
    navigate('/search/' + searchPhrase);
  }

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPhrase(event.target.value);
  }

  return <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
    <div className="input-group w-100 container-fluid">
      {window.location.pathname === '/' &&
        <button className="btn btn-outline-secondary search-btn" type="button" onClick={() => navigate(-1)}><i
          className="bi bi-arrow-left-circle"></i></button>
      }
      <input type="text" className="form-control" placeholder="Szukaj" onClick={() => navigate('/')}
        value={searchPhrase} onChange={onInputChange} />
      {
        window.location.pathname === '/' && <button className="btn btn-outline-secondary search-btn" type="button" onClick={clearInput}><i
          className="bi bi-x-circle"></i></button>
      }
      <button className="btn btn-outline-secondary search-btn" type="button" onClick={runSearch}><i
        className="bi bi-search"></i></button>
    </div>
  </nav>
};

export default SearchBarComponent;
