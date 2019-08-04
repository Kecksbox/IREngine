import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../../Constants/routes';

import { CardActionArea, Card } from '@material-ui/core';

import addIcon from './icons/addIcon.svg';

interface CollectionCardProps {
    isAddCard?: boolean,
    collectionName?: string,
    collectionCode?: string,
}

class CollectionCard extends React.Component<CollectionCardProps, any> {

    public render() {
        if (this.props.isAddCard) {
            return (
                <Link to={ROUTES.ADDCOLLECTION}>
                    <Card className="collectionCard">
                        <CardActionArea className="collectionCardActionArea">
                            <img src={addIcon} className="addIcon" />
                            <div className="addLable">Add collection</div>
                        </CardActionArea>
                    </Card>
                </Link>
            );
        } else {
            return (
                <Card className="collectionCard">
                    <CardActionArea className="collectionCardActionArea">
                        <div className="collectionName">{this.props.collectionName}</div>
                        <div className="collectionCode">{this.props.collectionCode}</div>
                    </CardActionArea>
                </Card>
            );
        }
    }

}

export default CollectionCard;