import React from 'react';

import { FormControl, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

import './index.scss';

interface DBSelectProps {
    selected: string,
    onChange: (event: any) => void,
}

class DBSelect extends React.Component<DBSelectProps, any> {

    public render() {
        return (
            <div>
                <FormControl component="fieldset" className="RadioButtonSection">
                    <RadioGroup
                        aria-label="gender"
                        name="gender1"
                        className="AddOptionGroup"
                        value={this.props.selected}
                        onChange={this.props.onChange}
                    >
                        <FormControlLabel value="local" control={
                            <Radio
                                color="primary"
                                icon={<RadioButtonUncheckedIcon fontSize="small" />}
                                checkedIcon={<RadioButtonCheckedIcon fontSize="small" />}
                            />
                        } label="Use our DB" />
                        <FormControlLabel value="firestore" control={
                            <Radio
                                color="primary"
                                icon={<RadioButtonUncheckedIcon fontSize="small" />}
                                checkedIcon={<RadioButtonCheckedIcon fontSize="small" />}
                            />
                        } label="Connect to Firestore" />
                        <FormControlLabel value="mongoDB" control={
                            <Radio
                                color="primary"
                                icon={<RadioButtonUncheckedIcon fontSize="small" />}
                                checkedIcon={<RadioButtonCheckedIcon fontSize="small" />}
                            />
                        } label="Connect to MongoDB" />
                    </RadioGroup>
                </FormControl>
            </div>
        );
    }

}

export default DBSelect;