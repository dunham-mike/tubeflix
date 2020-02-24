import React from 'react';

import classes from './Footer.module.css';
import linkedinIcon from '../../../assets/linkedin.svg';
import twitterIcon from '../../../assets/twitter.svg';
import githubIcon from '../../../assets/github.svg';

const footer = () => {
    return (
        <div className={classes.Footer}>
            <div className={classes.SocialIconContainer}>
                <a href="https://www.linkedin.com/in/mikeldunham/" target="_blank" rel="noopener noreferrer">
                    <img className={classes.SocialIcon} src={linkedinIcon} alt="linkedin-icon"/>
                </a>
                <a href="https://github.com/dunham-mike/" target="_blank" rel="noopener noreferrer">
                    <img className={classes.GithubIcon} src={githubIcon} alt="github-icon"/>
                </a>
                <a href="https://www.twitter.com/mldunham" target="_blank" rel="noopener noreferrer">
                    <img className={classes.SocialIcon} src={twitterIcon} alt="twitter-icon"/>
                </a>
            </div>
            
            <p>Icons courtesy of <strong><a target="_blank" rel="noopener noreferrer" href="https://www.iconfinder.com/">Iconfinder</a></strong> and <strong><a target="_blank" rel="noopener noreferrer" href="https://icons8.com">Icons8</a></strong></p>
            <p>© Mike Dunham 2020</p>
        </div>
        
    );
}

export default footer;