import React from 'react';

import classes from './UserInfo.module.css';

const userInfo = () => {
    return (
        <div className={classes.UserContent}>
            <p>Hi, welcome to Tubeflix! This is a React demo that imports YouTube content into a Netflix-style user interface.</p>
            <p>Social media contacts are at the bottom of the page. Thanks for checking it out! - Mike</p>
        </div>
        
    );
}

export default userInfo;