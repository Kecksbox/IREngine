import React from 'react';
import AuthOptions from '../AuthOptions';

import './index.scss';

class SignIn extends React.Component {

    public render() {
        return (
            <div>
                // this blueBar will probably be used in all other Components to
                // consider moving it into App
                <div className="blueBackgroundBar" />
                <AuthOptions />
            </div>
        );
    }

}

export default SignIn;