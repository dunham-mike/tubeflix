import React, { Component } from 'react';

import Video from './Video/Video';
import classes from './VideoCategory.module.css';
// import Aux from '../../../hoc/Auxiliary/Auxiliary';
import leftCaret from '../../../assets/left-caret.svg';
import rightCaret from '../../../assets/right-caret.svg';

class VideoCategory extends Component {
    state = {
        currentPage: 1
    }

    moveLeft = () => {
        this.setState(prevState => {
            if(prevState.currentPage > 1) {
                return { currentPage: prevState.currentPage - 1 }
            }
        });
        console.log('Left');
    }

    moveRight = () => {
        this.setState(prevState => {
            if(prevState.currentPage < 2) {
                return { currentPage: prevState.currentPage + 1 }
            }
        });
        console.log('Right');
    }

    render() {
        let allVideos = [...this.props.videos];

        const transformedVideos = allVideos.slice(0,this.props.pageSize*2).map(video => {
            return (
                <Video key={video.id} video={video} videoClicked={() => this.props.videoClicked(video.id)} />
            );
        });

        let leftCaretJsx = null;
        if (this.state.currentPage > 1) {
            leftCaretJsx = (
                <div className={classes.LeftCaretContainer} onClick={this.moveLeft}>
                        <div className={classes.CaretBackground}/>
                        <img src={leftCaret} className={classes.LeftCaret} alt="left-caret"/>
                </div>
            );
        }

        let rightCaretJsx = null;
        if (this.state.currentPage < 2) {
            rightCaretJsx = (
                <div className={classes.RightCaretContainer} onClick={this.moveRight}>
                        <div className={classes.CaretBackground}/>
                        <img src={rightCaret} className={classes.RightCaret} alt="right-caret"/>
                </div>
            );
        }

        return (
            <div className={classes.VideoCategory}>
                <div className={classes.VideoCategoryTitle}>{this.props.title}</div>
                <div className={classes.Carets}>
                    {leftCaretJsx}
                    {rightCaretJsx}
                </div>
                <div 
                    className={classes.Videos} 
                    style={{
                        left: (((this.state.currentPage - 1) * this.props.pageSize * -12.8) + 'rem'),
                        transform: 'translate3d(0, 0, 0)',
                        transitionDuration: '1000ms'
                    }} // Shift items left according to currentPage
                    >
                        
                        {transformedVideos}
                        
                        
                </div>
            </div>
        );
    }
        

    
    
}

export default VideoCategory;