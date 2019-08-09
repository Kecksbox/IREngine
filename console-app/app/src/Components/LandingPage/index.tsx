import React from 'react';

import { Divider } from '@material-ui/core';
import CollectionCard from './CollectionCard';

import './index.scss';

class LandingPage extends React.Component {

    public render() {
        return (
            <div>
                <div className="blueBackgroundBar" />
                <div className="collectionsContainer">
                    <h2 className="headLine">Your collections</h2>
                    <div className="collectionCardContainer">
                        <CollectionCard isAddCard={true}/>
                        <CollectionCard collectionName={"Example Collection 1"} collectionCode={"example-project-code-1"}/>
                        <CollectionCard collectionName={"Example Collection 1"} collectionCode={"example-project-code-1"}/>
                        <CollectionCard collectionName={"Example Collection 1"} collectionCode={"example-project-code-1"}/>
                        <Divider className="collectionFromInfoDivider" variant="middle" />
                    </div>
                </div>
            </div>
        );
    }

}

export default LandingPage;