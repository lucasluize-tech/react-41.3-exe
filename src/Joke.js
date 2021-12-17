import React, { useState } from "react";
import "./Joke.css";

function Joke({ vote, votes, text, id }) {
  const upVote = () => vote(id, +1);
  const downVote = () => vote(id, -1);
  let [isLock, setLock] = useState(false);

  const handleLock = () => {
    setLock(() => (isLock = !isLock));
    console.log(isLock);
    isLock
      ? (localStorage.lockItems = JSON.stringify([{ id, text, votes }]))
      : (localStorage.lockItems = []);
  };

  return (
    <div className='Joke'>
      <div className='Joke-votearea'>
        <button onClick={upVote}>
          <i className='fas fa-thumbs-up' />
        </button>

        <button onClick={downVote}>
          <i className='fas fa-thumbs-down' />
        </button>

        {votes}
      </div>

      <div className='Joke-text'>{text}</div>
      <button onClick={handleLock}>
        <i className='fas fa-lock' />
      </button>
    </div>
  );
}

export default Joke;
