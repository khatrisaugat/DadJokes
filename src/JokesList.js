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
        this.state = { jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"), isLoading: false };
        this.seenJokes = new Set(this.state.jokes.map(j => j.text));
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        if (this.state.jokes.length === 0) {
            this.getJokes();
        }
    }

    handleClick() {
        let jokes = this.state.jokes.sort((a, b) => b.vote - a.vote);
        this.setState({ isLoading: true, jokes: jokes }, this.getJokes);
    }

    async getJokes() {
        try {
            let jokes = [];
            while (jokes.length < this.props.numOfInitJokes) {
                let joke = await axios.get("https://icanhazdadjoke.com/", { headers: { Accept: 'application/json' } });
                // console.log(joke.data);
                if (!this.seenJokes.has(joke.data.joke)) {
                    jokes.push({ id: uuid(), text: joke.data.joke, vote: 0 });
                } else {
                    console.log("Found a duplicate");
                    console.log(joke.data.joke);
                }

            }
            // this.setState({ jokes: jokes });
            this.setState(st => ({
                jokes: [...st.jokes, ...jokes],
                isLoading: false
            }), () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes)));
            //localstorage
            // window.localStorage.setItem("jokes", JSON.stringify(jokes));
        } catch (error) {
            alert(error);
            this.setState({ isLoading: false });
        }
    }


    handleVote(id, v) {
        this.setState((st) => ({
            jokes: st.jokes.map(j => j.id === id ? { ...j, vote: j.vote + v } : j)
        }), () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes)));
    }
    render() {
        if (this.state.isLoading) {
            return (
                <div className="JokesList-spinner">
                    <i className="far fa-8x fa-laugh fa-spin"></i>
                    <h1 className="JokesList-title">Loading...</h1>
                </div>
            );
        }
        // let jokes = this.state.jokes.sort((a, b) => b.vote - a.vote);
        return (
            <div className="JokesList">
                <div className="JokesList-sidebar">
                    <h1 className="JokesList-title"><span>Dad</span> Jokes</h1>
                    <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' alt="Smiley face" />
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
