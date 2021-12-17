import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
  constructor(props) {
    super(props);
    this.vote = this.vote.bind(this);
    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.resetVotes = this.resetVotes.bind(this);
  }
  state = { jokes: JSON.parse(window.localStorage.getItem("jokes")) || [] };
  numJokesToGet = 3;

  storeLocalStorage(obj) {
    localStorage.jokes = JSON.stringify(obj);
  }

  async componentDidMount() {
    if (this.state.jokes.length === 0) {
      let j = [...this.state.jokes];
      let seenJokes = new Set();
      try {
        while (j.length < this.numJokesToGet) {
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" },
          });
          let { status, ...jokeObj } = res.data;
          // if joke not in seenJokes, add.
          if (!seenJokes.has(jokeObj.id)) {
            seenJokes.add(jokeObj.id);
            j.push({ ...jokeObj, votes: 0 });
          } else {
            console.error("duplicate found!");
          }
        }
        this.setState((jokes) => (this.state.jokes = j));
        this.storeLocalStorage([...this.state.jokes]);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevState.jokes) !== JSON.stringify(this.state.jokes)) {
      let j = [...this.state.jokes];
      let seenJokes = new Set();
      try {
        while (j.length < this.numJokesToGet) {
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" },
          });
          let { status, ...jokeObj } = res.data;
          // if joke not in seenJokes, add.
          if (!seenJokes.has(jokeObj.id)) {
            seenJokes.add(jokeObj.id);
            j.push({ ...jokeObj, votes: 0 });
          } else {
            console.error("duplicate found!");
          }
        }
        this.setState((jokes) => (this.state.jokes = j));
        this.storeLocalStorage([...this.state.jokes]);
      } catch (e) {
        console.log(e);
      }
    }
  }

  generateNewJokes() {
    this.setState({ jokes: [] });
    localStorage.removeItem("jokes");
  }

  resetVotes() {
    const reset = this.state.jokes.map((joke) => ({ ...joke, votes: 0 }));
    console.log(reset);
    this.setState({ jokes: reset });
    localStorage.jokes = JSON.stringify(this.state.jokes);
  }

  vote(id, delta) {
    const voted = this.state.jokes.map((j) =>
      j.id === id ? { ...j, votes: j.votes + delta } : j
    );
    this.setState({ jokes: voted });
    localStorage.jokes = JSON.stringify(this.state.jokes);
  }

  render() {
    if (this.state.jokes.length) {
      let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
      return (
        <div className='JokeList'>
          <button className='JokeList-getmore' onClick={this.generateNewJokes}>
            Get New Jokes
          </button>

          {sortedJokes.map((j) => (
            <Joke
              text={j.joke}
              key={j.id}
              id={j.id}
              votes={j.votes}
              vote={this.vote}
            />
          ))}
          <button className='JokeList-resetBtn' onClick={this.resetVotes}>
            Reset Votes
          </button>
        </div>
      );
    } else {
      return <div className='loader'></div>;
    }
  }
}

export default JokeList;
