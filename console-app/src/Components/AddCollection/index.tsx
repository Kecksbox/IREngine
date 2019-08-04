import React from 'react';
import { Card } from '@material-ui/core';

import './index.scss';

class AddCollection extends React.Component {

    public render() {
        return (
            <div>
                <div className="blueBackgroundBar" />
                <Card className="addCollCard">
                    <div className="addCollLable">Where will your documents be stored?</div>
                    <div className="radioButtonSection"></div>
                    <div className="LearnMore"></div>
                </Card>
            </div>
        );
    }

}

export default AddCollection;