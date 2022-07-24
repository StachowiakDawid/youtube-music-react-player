import React, { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { getSelectedItem, setSelectedItem } from '../../slices/playerSlice';
import { setSearchPhrase, getSearchPhrase } from '../../slices/searchPhraseSlice';
import { setSearchResults, getSearchResults } from '../../slices/searchResultsSlice';
import axios from 'axios';
import { YT_API_KEY, YT_API_URL } from '../../constants';
interface SearchResultsComponentProps { }

const SearchResultsComponent: FC<SearchResultsComponentProps> = () => {
  const dispatch = useAppDispatch();
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const selectedItem = useAppSelector(getSelectedItem);
  const searchPhrase = useAppSelector(getSearchPhrase);
  const { phrase } = useParams();
  const [dataLength, setDataLength] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const searchResults = useAppSelector(getSearchResults);
  const [nextPageToken, setNextPageToken] = useState('');

  useEffect(() => {
    if (selectedItem === -1) {
      setSelectedItemIndex(-1);
    }
    if (searchPhrase !== phrase) {
      dispatch(setSearchPhrase(phrase!));
      fetchData();
    } else {
      setIsLoaded(true);
      setDataLength(searchResults.length);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);

  const fetchData = (pageToken?: string) => {
    const params = new URLSearchParams();
    params.append('part', 'id');
    params.append('part', 'snippet');
    params.append('maxResults', '25');
    params.append('type', 'video');
    params.append('key', YT_API_KEY);
    params.append('q', phrase!);
    if (typeof pageToken !== 'undefined') {
      params.append('pageToken', nextPageToken);
    }
    axios.get(YT_API_URL, {
      params: params
    }).then(
      (result) => {
        setIsLoaded(true);
        if (typeof pageToken === 'undefined') {
          dispatch(setSearchResults((result as any).data.items));
          setDataLength((result as any).data.items.length);
        } else {
          dispatch(setSearchResults(searchResults.concat((result as any).data.items)));
          setDataLength((result as any).data.items.length + dataLength);
        }
        setNextPageToken((result as any).data.nextPageToken);
      }
    ).catch((error) => {
      console.log(error);
    });
  };

  const handleClick = async (index: number) => {
    if (index !== selectedItemIndex) {
      setSelectedItemIndex(index);
      dispatch(setSelectedItem((searchResults[index] as any)));
    }
  };

  return <InfiniteScroll dataLength={dataLength}
    next={() => fetchData(nextPageToken)}
    hasMore={true}
    loader={<></>}
  >
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <ul className="list-group list-group-flush">
            {isLoaded &&
             searchResults.map((item: any, index: number) => (
              <li className={"list-group-item ps-0 " + ((selectedItemIndex === index) ? 'bg-light' : '')} key={item.id.videoId} onClick={() => handleClick(index)}>
                <div className="row">
                  <div className="col-sm-4">
                    <img className="w-100" alt="thumbnail" src={item.snippet.thumbnails.medium.url} />
                  </div>
                  <div className="col-sm-8">
                    <h5 className="mt-2" dangerouslySetInnerHTML={{ __html: item.snippet.title }}></h5>
                    <h6>{item.snippet.channelTitle}<i className="bi bi-dot"></i> {item.snippet.publishedAt.split("T")[0]} </h6>
                    <p> {item.snippet.description} </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </InfiniteScroll>
};

export default SearchResultsComponent;
