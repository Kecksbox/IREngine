import React from 'react';

import './index.scss';

import { TextField } from '@material-ui/core';

interface ChooseNameProps {
    name: string,
    onChange: (event: any) => void,
}

class ChooseName extends React.Component<ChooseNameProps, any> {

    public render() {
        return (
            <div>
                <TextField
                    id="standard-name"
                    label="Name"
                    className="NameField"
                    value={this.props.name}
                    onChange={this.props.onChange}
                    margin="normal"
                />
            </div>
        );
    }

}

export default ChooseName;