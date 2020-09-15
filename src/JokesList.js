import React, { Component } from 'react';
import axios from 'axios';
import './JokesList.css';
import { v4 as uuid } from 'uuid';
import Joke from './Joke';


// API_URL = "https://icanhazdadjoke.com/";

class JokesList extends Component {
    static defaultProps = {
        numOfInitJokes: 10
    };

    constructor(props) {
        super(props);
        this.state = { jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]") };
        // this.handleVote = this.handleVote.bind(this);
    }
    componentDidMount() {
        if (this.state.jokes.length === 0) {
            this.getJokes();
        }
    }

    async getJokes() {
        let jokes = [];
        while (jokes.length < this.props.numOfInitJokes) {
            let joke = await axios.get("https://icanhazdadjoke.com/", { headers: { Accept: 'application/json' } });
            // console.log(joke.data);
            jokes.push({ id: uuid(), text: joke.data.joke, vote: 0 });
        }
        this.setState({ jokes: jokes });
        //localstorage
        window.localStorage.setItem("jokes", JSON.stringify(jokes));
    }


    handleVote(id, v) {
        this.setState((st) => ({
            jokes: st.jokes.map(j => j.id === id ? { ...j, vote: j.vote + v } : j)
        }));
    }
    render() {
        return (
            <div className="JokesList">
                <div className="JokesList-sidebar">
                    <h1 className="JokesList-title"><span>Dad</span> Jokes</h1>
                    <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
                    <button className='JokesList-getmore' onClick={this.handleClick}>New Jokes</button>
                </div>
                <div className="JokesList-jokes">
                    {this.state.jokes.map(joke => <Joke key={joke.id} text={joke.text} vote={joke.vote} upvote={() => this.handleVote(joke.id, 1)} downvote={() => this.handleVote(joke.id, -1)} />)}
                </div>
            </div>
        )
    }
}

export default JokesList;
