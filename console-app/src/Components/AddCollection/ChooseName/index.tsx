import React from 'react';

import './index.scss';

import * as ROUTES from '../../../Constants/routes';
import LearnMore from '../../LearnMore';
import { TextField } from '@material-ui/core';

class ChooseName extends React.Component<any, any> {

    public render() {
        return (
            <div>
                <TextField
                    id="standard-name"
                    label="Name"
                    className="NameField"
                    value={this.props.name}
                    onChange={this.props.handleNameChange}
                    margin="normal"
                />
            </div>
        );
    }

}

export default ChooseName;