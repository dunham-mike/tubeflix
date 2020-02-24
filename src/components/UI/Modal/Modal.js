import React from 'react';

import classes from './Modal.module.css';

const modal = ( props ) => {
    return (
        <React.Fragment>
            <div className={classes.Backdrop} onClick={props.clicked}></div>
            <div className={classes.Modal}>
                <iframe 
                    title={props.video}
                    width="100%"
                    height="100%" 
                    src={"https://www.youtube.com/embed/" + props.video + '?autoplay=1'}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen">
                </iframe>
            </div> 
        </React.Fragment>
    );
}

export default modal;