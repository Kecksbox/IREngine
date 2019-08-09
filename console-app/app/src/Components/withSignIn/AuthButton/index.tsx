import React from 'react';
import Button from '@material-ui/core/Button';

import './index.scss';

interface AuthButtonProps {
    service: string,
    logo: string,
    onClick: (event: any) => void,
}

class AuthButton extends React.Component<AuthButtonProps, any> {

    public render() {
        return (
            <Button className = {this.props.service} onClick={this.props.onClick}>
                <img className={`ServiceLogo ${this.props.service}Logo`} src={this.props.logo} />
                <span className="AuthButtonLable">Sign in with {this.props.service}</span>
            </Button>
        );
    }

}

export default AuthButton;