import React, { FC, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import { getSearchPhrase } from '../../slices/searchPhraseSlice';

interface SearchBarComponentProps { }

const SearchBarComponent: FC<SearchBarComponentProps> = () => {
  const navigate = useNavigate();
  const searchPhrase = useAppSelector(getSearchPhrase);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const addItemToHistory = (item: string) => {
    let history = JSON.parse(localStorage['searchHistory']);
    let contains = false;
    item = item.trim();
    history.forEach((element: any) => {
      if (element.phrase === item) {
        contains = true;
        element.timestamp = Date.now();
      }
    });
    if (!contains) {
      history.push({ phrase: item, timestamp: Date.now() });
    }
    history = history.sort((a: any, b: any) => {
      return b.timestamp - a.timestamp;
    });
    localStorage['searchHistory'] = JSON.stringify(history);
  }

  const clearInput = () => {
    searchInputRef.current!.value = '';
  }

  const runSearch = () => {
    if (searchInputRef.current!.value !== '') {
      addItemToHistory(searchInputRef.current!.value);
      navigate('/search/' + searchInputRef.current!.value);
    }
  }

  return <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
    <div className="input-group w-100 container-fluid">
      {window.location.pathname === '/' &&
        <button className="btn btn-outline-secondary search-btn" type="button" onClick={() => navigate(-1)}><i
          className="bi bi-arrow-left-circle"></i></button>
      }
      <input type="text" className="form-control" placeholder="Szukaj" onClick={() => navigate('/')} ref={searchInputRef} defaultValue={searchPhrase} key={searchPhrase}/>
      {
        window.location.pathname === '/' && <button className="btn btn-outline-secondary search-btn" type="button" onClick={() => clearInput()}><i
          className="bi bi-x-circle"></i></button>
      }
      <button className="btn btn-outline-secondary search-btn" type="button" onClick={() => runSearch()}><i
        className="bi bi-search"></i></button>
    </div>
  </nav>
};

export default SearchBarComponent;
