import React, { Component } from 'react';
import GuessGame from './GuessGame';
export default class App extends Component {
    render() {
        let serverBaseUrl = "http://localhost:4000";
        return (
            <div align="center">
                <GuessGame
                    newPasswordUrl={serverBaseUrl + "/new-password"}
                    verifyPasswordUrl={serverBaseUrl + "/verify-password"} />
            </div>
        );
    }
}
