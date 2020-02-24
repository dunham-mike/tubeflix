import React, { Component } from 'react';

import classes from './App.module.css';
import Layout from './containers/Layout/Layout';
import MainView from './containers/MainView/MainView';

class App extends Component {
    state = {
        randomizeCategoryCount: 0,
        randomizeFeaturedCount: 0
    }

    handleRandomizeCategories = () => {
        this.setState(prevState => {
            return {randomizeCategoryCount: prevState.randomizeCategoryCount+1}
        });
    }

    handleRandomizeFeatured = () => {
        this.setState(prevState => {
            return {randomizeFeaturedCount: prevState.randomizeFeaturedCount+1}
        });
    }

    render() {
        return (
            <div className={classes.App}>
                <Layout 
                    randomizeCategories={this.handleRandomizeCategories}
                    randomizeFeatured={this.handleRandomizeFeatured}
                >
                    <MainView 
                        randomizeCategoryCount={this.state.randomizeCategoryCount}
                        randomizeFeaturedCount={this.state.randomizeFeaturedCount} />
                </Layout>
            </div>
        );
    }
}

export default App;
