import React from 'react';

import * as firebase from 'firebase';

import { Card, Button } from '@material-ui/core';
import DBSelect from './DBSelect';
import ChooseName from './ChooseName';
import LearnMore from '../LearnMore';

import './index.scss';

import * as STEPS from './Constants/steps';

interface AddCollectionStep {
    id: number,
    lable: {
        firstLine: string,
        secondLine: string,
    },
    learnMoreRoot: string,
    buttonLable: string,
}

interface AddCollectionState {
    step: AddCollectionStep,
    selected: string,
    name: string,
}

class AddCollection extends React.Component<any, AddCollectionState> {

    state = {
        step: STEPS.DBSelect,
        selected: "local",
        name: "",
    }

    public render() {
        return (
            <div>
                <div className="blueBackgroundBar" />
                <Card className="addCollCard">
                    <div className="addCollLable">
                        {this.state.step.lable.firstLine} <br />
                        {this.state.step.lable.secondLine}
                    </div>
                    {this.renderCardContent()}
                    <div className="LearnMore">
                        <LearnMore route={this.state.step.learnMoreRoot} />
                    </div>
                    <Button className="NextButton" onClick={this.handleClickNext.bind(this)}>
                        {this.state.step.buttonLable}
                    </Button>
                    <a className="BackLable" onClick={this.handleClickBack.bind(this)}>
                        Back
                    </a>
                </Card>
            </div>
        );
    }

    private handleClickNext() {
        switch(this.state.step.id) {
            case 0:
                this.setState({
                    step: this.selectNextStepBasedOnSelection(),
                });
            break;
            case 3:
                this.createNewCollection();
            break;
            default:
                    throw new EvalError("Unexpected state.");
        }
    }

    private handleClickBack() {
        console.log("back");
    }

    private renderCardContent(): React.ReactNode {
        switch(this.state.step.id) {
            case 0:
                return <DBSelect selected={this.state.selected} onChange={this.handleDBChange.bind(this)} />
            case 3:
                return <ChooseName name={this.state.name} onChange={this.handleNameChange.bind(this)}/>;
            default:
                throw new EvalError("Unexpected state.");
        }
    }

    private handleDBChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            selected: event.target.value,
        });
    }

    private handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            name: event.target.value,
        })
    }

    private selectNextStepBasedOnSelection() {
        switch(this.state.selected) {
            case "local":
                return STEPS.ChooseName;
            case "firestore":
                return STEPS.DBSelect;
            case "mongoDB":
                return STEPS.DBSelect;
            default:
                throw new EvalError("Unexpected state.");
        }
    }

    private createNewCollection() {
        const createCollectionCloudFunction = firebase.functions().httpsCallable('createNewCollection');
        createCollectionCloudFunction(this.state).then(result => {
            console.log(result);
            console.log('success. Back to home Screen or to collection home screen');
        })
    }

}

export default AddCollection;