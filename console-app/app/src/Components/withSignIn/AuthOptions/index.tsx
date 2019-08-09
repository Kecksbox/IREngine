import React from 'react';
import * as firebase from "firebase/app";

import "firebase/auth";

import AuthButton from '../AuthButton';

import './index.scss';

import GoogleLogo from '../AuthButton/icons/GoogleLogo.svg';
import GitHubLogo from '../AuthButton/icons/GitHubLogo.svg';
import EmailLogo from '../AuthButton/icons/EmailLogo.svg';

class AuthOptions extends React.Component {

    private googleSignInProvider = new firebase.auth.GoogleAuthProvider();

    public render() {
        return (
            <div className="AuthConatiner">
                <div className="AuthButttonConatainer">
                    <AuthButton service={'Google'} logo={GoogleLogo} onClick={this.handleGoogleButtonClick.bind(this)} />
                    <AuthButton service={'GitHub'} logo={GitHubLogo} onClick={this.handleGoogleButtonClick.bind(this)} />
                    <AuthButton service={'Email'} logo={EmailLogo} onClick={this.handleGoogleButtonClick.bind(this)} />
                </div>
                <div className="Disclaimer">
                    By continuing, you are indicationg that you accept <br />
                    our <a>Terms of Service</a> and <a>Privacy Policy</a>
                </div>
            </div>
        );
    }

    private handleGoogleButtonClick() {
        console.log('trying to log in with google.');
        firebase.auth().signInWithRedirect(this.googleSignInProvider);
    }
}

export default AuthOptions;