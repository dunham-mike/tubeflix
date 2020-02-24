import React, { Component } from 'react';

import Header from '../../components/UI/Header/Header';
import Footer from '../../components/UI/Footer/Footer';
import classes from './Layout.module.css';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.layoutRef = React.createRef();
    }

    state = {
        isTop: true, // For tracking whether user is scrolled high enough that the header should be transparent
        screenWidth: 1100 // Default of 1100 pixels
    }

    componentDidMount = () => {
        this.handleResize();
        document.addEventListener('scroll', this.checkIsTop, true);
        window.addEventListener('resize', this.handleResize, true); 
    }

    componentWillUnmount = () => {
        document.removeEventListener('scroll', this.checkIsTop, true);
        window.removeEventListener('resize', this.handleResize, true);
    }

    checkIsTop = () => {
        // Maxres YouTube thumbnail size: 1280 x 720 or height is 1.7777x the width

        const isTop = window.scrollY < (this.state.screenWidth / 1.77777 * 0.05);
        if (isTop !== this.state.isTop) {
            this.setState({ isTop });
            // console.log(isTop);
        }
    }

    handleResize = () => {
        // console.log('Layout Resized!');
        // console.log(this.layoutRef.current.offsetWidth);
        this.setState({ screenWidth: this.layoutRef.current.offsetWidth });
    }

    render() {
        return (
            <React.Fragment>
                <Header 
                    isTop={this.state.isTop} 
                    randomizeCategories={this.props.randomizeCategories}
                    randomizeFeatured={this.props.randomizeFeatured}
                />
                    <main className={classes.Content} ref={this.layoutRef}>{this.props.children}</main>
                <Footer />
            </React.Fragment>
        );
    }
}

export default Layout;