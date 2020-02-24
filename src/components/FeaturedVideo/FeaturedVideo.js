import React from 'react';
import classes from './FeaturedVideo.module.css';

import Button from 'react-bootstrap/Button';
import { IoMdPlay as PlayIcon } from "react-icons/io";

const featuredVideo = ( props ) => {
    const thumbnailHeight= props.screenWidth / 1.77777;

    let descriptionMaxLength = 400;

    switch(true) {
        case (props.screenWidth < 600):
            descriptionMaxLength = 0;
            break;
        case (props.screenWidth < 700):
            descriptionMaxLength = 47;
            break;
        case (props.screenWidth < 950):
            descriptionMaxLength = 97;
            break;
        case (props.screenWidth < 1050):
            descriptionMaxLength = 137;
            break;
        case (props.screenWidth < 1200):
            descriptionMaxLength = 187;
            break;
        case (props.screenWidth < 1350):
            descriptionMaxLength = 225;
            break;
        default:
            break;
    }

    const firstNewLine = props.video.snippet.description.split('').indexOf('\n');
    
    let abbreviatedDescription = props.video.snippet.description;

    if (firstNewLine > -1) {
        abbreviatedDescription = abbreviatedDescription.slice(0, firstNewLine);
    } 
    
    if (abbreviatedDescription.length > descriptionMaxLength) {
        abbreviatedDescription = abbreviatedDescription.slice(0, descriptionMaxLength);
        
        if(descriptionMaxLength > 0) {
            abbreviatedDescription += '...';
        }
    }
        
    // console.log('Negative margin:' + (-thumbnailHeight * 0.3)+'px');
    return(
        <div className={classes.FeatureVideoContainer}>
            <div 
                className={classes.OverlayContent}
                style={{
                    marginTop: Math.max(thumbnailHeight * 0.2, 100)+'px'
                }}
            >
                    <div className={classes.ChannelTitle}>{props.video.snippet.channelTitle}</div>
                    <div className={classes.VideoTitle}>{props.video.snippet.title}</div>
                    <div className={classes.VideoDescription}>{abbreviatedDescription}</div>
                    <Button 
                        variant='outline-light'
                        className={classes.PlayButton}
                        onClick={() => props.videoClicked(props.video.id)}>
                            <PlayIcon /> Play
                    </Button>
                
            </div>
            <img 
                style={{                           
                    marginBottom: (props.screenWidth > 860 ? Math.max((-thumbnailHeight * 0.3), -350)+'px' : '0'),
                    height: (props.screenWidth / 1.7777) + 'px'
                }}
                className={classes.FeaturedVideoImage} 
                src={props.video.snippet.thumbnails.maxres.url} 
                alt='featured-video-thumbnail' />
            <div 
                className={classes.OpacityOverlay} 
                style={{ height: thumbnailHeight + 'px'}}
                />
            
            
        </div>
        
    );
}

export default featuredVideo;