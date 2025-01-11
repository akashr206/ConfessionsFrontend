import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Confession from './Components/Confession';
import Add from './Components/Add';
import Comment from './Components/Comment';

function App() {
  const [confessions, setConfessions] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [showAdd, setshowAdd] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setcount] = useState("...");
  const [showcomment, setShowComment] = useState(false);
  const [commentId, setCommentId] = useState('')
  async function getConfessions() {
    const API_URL = import.meta.env.VITE_URL;
    try {
      console.log(API_URL);
      const res = await fetch(`${API_URL}/confessions?page=${currentPage}`);
      const data = await res.json();
      setConfessions((prevConfessions) => [...prevConfessions, ...data.confessions]);
      setcount(data.pagination.totalConfessions)
      if (data.confessions.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to fetch confessions:', error);
    }
  }

  function handleCommentOpen(id) {
    setCommentId(id)
    setShowComment(true)
  }

  useEffect(() => {
    getConfessions();
    
  }, [currentPage]);

  const fetchMoreData = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  return (
    <>
      <header className="z-30 text-center text-3xl m-auto fixed w-full p-5 bg-neutral-900 text-purple-500">
        <h1>UVCE CONFESSIONS</h1>
      </header>
        {showcomment && <Comment id={commentId} onCloseComment={() => setShowComment(false)}/>}
      <div className="py-[76px] px-8 sm:p-24 flex flex-col items-center">
        <p className='text-xl my-2'>Total Confessions : {count}</p>
      <div className="add">
      {showAdd ? (
          <Add closeAdd={() => setshowAdd(false)}></Add>
        ) : (
          <button
            type="button"
            className="focus:outline-none w-full sm:w-[200px] text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-lg px-5 py-2.5 mb-6 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            onClick={() => setshowAdd(true)}
          >
            Add Confession
          </button>
        )}
      </div>
        <InfiniteScroll
          dataLength={confessions.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<p className='text-center'>Loading Confessions....</p>}
          endMessage={<div className='flex gap-1 justify-center items-center'><div className='border w-20 h-0'></div>||<div className='border w-20 h-0'></div></div>}
        >
          <div className="flex flex-wrap justify-center gap-4 w-full">
            {confessions.map((confession) => (
              <Confession key={confession._id} onComment={()=>handleCommentOpen(confession._id)} text={confession.text} createdAt={confession.createdAt} likes={confession.likes} />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </>
  );
}

export default App;
