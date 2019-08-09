import React from 'react';

import { Link } from 'react-router-dom';

import './index.scss';

import lightBulb from './icons/lightbulb.svg';

interface learnMoreProps {
    route: string,
}

class LearnMore extends React.Component<learnMoreProps, any> {

    public render() {
        return (
            <div>
                <img src={lightBulb} className="LightBulb"/>
                <Link to={this.props.route} className="LearnMoreLable">
                    Learn More
                </Link>
            </div>
        );
    }

}

export default LearnMore;