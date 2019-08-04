import React from 'react';
import * as firebase from 'firebase';

import SignIn from './SignIn';

function withSignIn(WrappedComponent: any) {
    return class extends React.Component {

        async componentDidMount() {
            firebase.auth().onAuthStateChanged(() => {
                this.setState({});
            });
        }

        render() {
            if (firebase.auth().currentUser) {
                return <WrappedComponent {...this.props} />;
            }
            return <SignIn />;
        }

    }
}

export default withSignIn;