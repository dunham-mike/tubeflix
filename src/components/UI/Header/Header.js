import React, { Component } from 'react';

import UserInfo from './UserInfo/UserInfo';

import playLogo from '../../../assets/play-logo-cropped.png';
import smileIcon from '../../../assets/smile-icon.jpg';
import downCaret from '../../../assets/down-caret.svg';
import classes from './Header.module.css';

class Header extends Component {
    state = {
        displayUserInfo: false
    }

    activateUserInfo = () => {
        this.setState({displayUserInfo: true});
    }

    deactivateUserInfo = () => {
        this.setState({displayUserInfo: false});
    }

    render() {
        const headerClasses = [classes.Header];

        if (!this.props.isTop) {
            headerClasses.push(classes.Opaque);
        }

        const userInfoContainerClasses = [classes.UserInfoContainer];

        if (!this.state.displayUserInfo) {
            userInfoContainerClasses.push(classes.Hide);
        }

        return (
            <div className={headerClasses.join(' ')}>
                <div className={classes.FullLogo}>
                    <img 
                        src={playLogo} 
                        className={classes.LogoImage}
                        alt='Play Logo'/>
                    <div className={classes.LogoText}>Tubeflix</div>
                </div>
                <div className={classes.Links}>
                    <div className={classes.Link}>
                        <a href="#top">Home</a>
                    </div>
                    <div className={classes.Link}>
                        <div onClick={this.props.randomizeCategories}><a href="#randomize-categories">Randomize Categories</a></div>
                    </div>
                    <div className={classes.Link}>
                        <div onClick={this.props.randomizeFeatured}><a href="#randomize-featured" >Randomize Featured Video</a></div>
                    </div>
                </div>
                <div className={classes.RightSide} onMouseEnter={this.activateUserInfo} onMouseLeave={this.deactivateUserInfo}>
                    <img src={smileIcon} className={classes.SmileIcon} alt='smile-icon' />
                    <img src={downCaret} className={classes.DownCaret} alt='down-caret' />
                </div>
                <div className={userInfoContainerClasses.join(' ')}>
                    <img src={downCaret} className={classes.UpCaret} alt='up-caret' />
                    <div className={classes.UserInfoContent}>
                        <div className={classes.UserInfoBackground}></div>
                        <UserInfo />
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;