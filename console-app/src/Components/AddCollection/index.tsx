import React from 'react';
import { Card } from '@material-ui/core';

import './index.scss';
import AddGroup from './AddGroup';

class AddCollection extends React.Component {

    public render() {
        return (
            <div>
                <div className="blueBackgroundBar" />
                <Card className="addCollCard">
                    <div className="addCollLable">Where will your documents be <br/> stored?</div>
                    <AddGroup/>
                    <div className="LearnMore"></div>
                </Card>
            </div>
        );
    }

}

export default AddCollection;