import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import AttemptList from '../AttemptList/AttemptList';
import axios from 'axios';
import './GuessGame.css'
export default class GuessGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attempts: [],
            hint: null,
            isFetching: false,
            answer: '',
            maxDigits:8
        };  // Redux to be used instead TODO
        this.input = React.createRef(); // reference to input textbox
        this.keypressHandler = this.keypressHandler.bind(this);
        this.changeHandler=this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }
    componentDidMount() {
        this.setState({ hint: 'fetching...', isFetching: true });
        this.input.current.focus(); //set focus at init
    }

    componentWillMount() {
        axios.get(this.props.newPasswordUrl)
            .then((res) => {
                this.setState({ hint: res.data.hint,maxDigits:res.data.hint.length }); //fetch and set hint from Password API server
            });
    }
    keypressHandler(evt) {
        let answer = this.input.current.value;
        // console.log('answer: ' + answer);
        // console.log('Pressed: ',evt.which,evt.keyCode);
        if (evt.which === 8) { // If Bksp key is pressed, then delete
            if (answer.length > 0) {
                this.setState({ answer: answer.slice(0, -1) });
            }
            return;
        }
        // console.log("Enter Key checking",evt.key);
        if (evt.which === 13) { // If Enter key is pressed, then submit
            this.submitHandler(evt);
            return;
        }
        // console.log("Digit Checking");
        if (evt.which < 48 || evt.which > 57) { // if not a digit, ignore.
            evt.preventDefault();
            return;
        }
        let hint = this.state.hint;
        if (answer.indexOf(evt.key) >= 0 || hint.indexOf(evt.key) === -1) {
            // if digit exists, ignore the key.
            evt.preventDefault();
            return;
        }
    }
    changeHandler(evt){
        // console.log('changed to: '+evt.target.value);
        this.setState({ answer: evt.target.value }); // set the new answer
    }
    submitHandler(evt) {
        evt.preventDefault(); // prevent page refresh
        //POST to API server for verification
        axios.post(this.props.verifyPasswordUrl,
            {
                hint: this.state.hint,
                answer: this.state.answer
            }
        ).then((response) => {
            // reset the input textbox after response received
            this.input.current.value = '';
            this.input.current.focus();

            // add response to attempts list
            let data = response.data;
            let attempts = this.state.attempts;
            attempts.push({
                answer: data.answer,
                highlight: data.highlight
            });
            this.setState({
                attempts,
                answer: '',
                correct: data.correct
            });
        });
    }
    render() {
        return (
            <div className="d-flex align-items-stretch justify-content-center flex-column">
                <h1 className="title m-2">Guess The Password!</h1>
                <h2 className="hint m-2">{this.state.hint}</h2>

                <AttemptList attempts={this.state.attempts} />

                {this.state.correct && <div className="title">You win</div>}

                {!this.state.correct && <div className="bottom-elements">
                    <input placeholder="Type here" type="text"
                        ref={this.input} maxLength={this.state.maxDigits} className="answer m-3" id="answer"
                        onKeyPress={this.keypressHandler}
                        autoComplete="off"
                        onChange={this.changeHandler}
                    >
                    </input>
                    <br />
                    <Button type="submit" variant="outline-dark" className="align-bottom"
                        onClick={this.submitHandler}
                        disabled={!this.state.answer || this.state.answer.length < this.state.maxDigits}>
                        Submit
                    </Button>
                </div>
                }
            </div>
        );
    }
}