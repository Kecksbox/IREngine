import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';

import "firebase/auth";

import NotFound from '../NotFound';
import LandingPage from '../LandingPage';
import AddCollection from '../AddCollection';

import withSignIn from '../withSignIn';

import * as ROUTES from '../../Constants/routes';

class App extends React.Component {

    public render() {
        return (
            <Router>
                <Switch>
                    <Route exact path={ROUTES.LANDING} component={LandingPage} />
                    <Route path={ROUTES.ADDCOLLECTION} component={AddCollection} />
                    <Route component={NotFound} />
                </Switch>
            </Router>
        );
    }

}

export default withSignIn(App);