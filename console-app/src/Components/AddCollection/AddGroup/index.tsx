import React from 'react';
import { RadioGroup, FormControlLabel, Radio, FormControl } from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

import './index.scss';

class AddGroup extends React.Component {

    state = {
        selected: "0",
    }

    public render() {
        return (
            <FormControl component="fieldset" className="RadioButtonSection">
                <RadioGroup
                    aria-label="gender"
                    name="gender1"
                    className="AddOptionGroup"
                    value={this.state.selected}
                    onChange={this.handleChange.bind(this)}
                >
                    <FormControlLabel value="0" control={
                        <Radio
                            color="primary"
                            icon={<RadioButtonUncheckedIcon fontSize="small" />}
                            checkedIcon={<RadioButtonCheckedIcon fontSize="small" />}
                        />
                    } label="Use our DB" />
                    <FormControlLabel value="1" control={
                        <Radio
                            color="primary"
                            icon={<RadioButtonUncheckedIcon fontSize="small" />}
                            checkedIcon={<RadioButtonCheckedIcon fontSize="small" />}
                        />
                    } label="Connect to Firestore" />
                    <FormControlLabel value="2" control={
                        <Radio
                            color="primary"
                            icon={<RadioButtonUncheckedIcon fontSize="small" />}
                            checkedIcon={<RadioButtonCheckedIcon fontSize="small" />}
                        />
                    } label="Connect to MongoDB" />
                </RadioGroup>
            </FormControl>
        );
    }

    private handleChange(event: React.ChangeEvent<unknown>) {
        this.setState({
            selected: (event.target as HTMLInputElement).value,
        });
    }

}

export default AddGroup;