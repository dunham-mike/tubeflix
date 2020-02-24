import React, { Component } from 'react';

import classes from './Video.module.css';
import circlePlayIcon from '../../../../assets/circle-play-icon.png';
// import circlePlayIcon from '../../../../assets/play-logo-cropped.png';

class Video extends Component {
    state = {
        showContentOverlay: false
    }

    activateContentOverlay = () => {
        this.setState({showContentOverlay: true});
    }

    deactivateContentOverlay = () => {
        this.setState({showContentOverlay: false});
    }

    render() {

        return (
            <React.Fragment>
                    <div className={classes.VideoContainer} >
                        <div className={classes.VideoInnerContainer} onMouseEnter={this.activateContentOverlay} onMouseLeave={this.deactivateContentOverlay} onClick={this.props.videoClicked}>
                            <div className={classes.ExpandingContainer} >
                                    <img 
                                        src={this.props.video.snippet.thumbnails.high.url}
                                        className={classes.VideoThumb}
                                        alt={this.props.video.snippet.title}>
                                    </img>
                                <div className={this.state.showContentOverlay ? classes.VideoOverlayContainer : classes.hideContainer }></div>
                            </div>
                            <div className={this.state.showContentOverlay ? classes.VideoOverlayContent : classes.hideContent }>
                                <img src={circlePlayIcon} className={classes.playIcon} alt="play-icon"/><br/>
                                {this.props.video.snippet.title}
                                
                            </div>
                        </div>
                        
                    </div>
            </React.Fragment>
        );
    }
    
}

export default Video;