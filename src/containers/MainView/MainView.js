import React, { Component } from 'react';

import axios from '../../axios';
import classes from './MainView.module.css';
import VideoCategories from '../../components/VideoCategories/VideoCategories';
import Modal from '../../components/UI/Modal/Modal';
import FeaturedVideo from '../../components/FeaturedVideo/FeaturedVideo';

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

class MainView extends Component {
    // From: https://reactjs.org/docs/refs-and-the-dom.html#creating-refs
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    /*  Query load per page load:
        - Categories: 3 points (1 base + 2 for snippet)
        - Individual Videos: 15 points = (1 base + 2 for snippet) x 5 individual videos
        - Category Videos: 270 points = (1 base + 2 for snippet ) x 18 videos per category x 5 categories (usually)
        - Total: 288 points per page refresh
        - Daily Usage: 34 page loads
    */
    state = {

        // App's Internal Data for Loading Components
        appVideoCategories: null, // Array of category objects
        appMostPopularVideosByCategory: null, // Dictionary of video arrays stored with the category ID as the key
        appMostPopularIndividualVideos: null, // Array of videos, in order of popularity
        appFailureToLoad: false,

        // Data Loaded from YouTube API and Settings & Status for API
        youTubeVideoCategories: null,
        youTubeMostPopularVideosByCategory: {}, // Needs to be an object so that key-value pairs can be added
        youTubeMostPopularIndividualVideos: null,
        youTubeGapiReady: false, // Tracking that the YouTube API is ready
        youTubeNumVideosToLoad: 20, // Hard-coded manually right here
        youTubeNumFeaturedToLoad: 10, // Hard-coded manually right here
        youTubeFailureToLoad: false,
        youTubeCategoryLoadsBack: 0,
        // someVideosLoaded: false,
        // individualVideosLoaded: false,

        // Data Loaded from Firebase Database
        databaseVideoCategories: null,
        databaseMostPopularVideosByCategory: null,
        databaseMostPopularIndividualVideos: null,

        // Rest of App State
        playVideo: false,
        videoToPlay: null,
        screenWidth: 1100, // Default for 5 video page size
        pageSize: 5, // Default for 5 video page size
        featuredVideo: 0, // Updates in randomizeFeatured()
        maxCategoriesToShow: 3, // Hard-coded manually right here
        randomizeCategoryCount: 0,
        randomizeFeaturedCount: 0,
        showYouTubeRefresh: false
    }

    componentDidMount = () => {
        console.log(process.env.REACT_APP_YOUTUBE_API_KEY);
        // this.kickoffYouTubeApi();
        this.getAllDatabaseData();
        this.handleResize();
        window.addEventListener('resize', this.handleResize, true);

        this.randomizeFeatured();
    }

    componentWillUnmount = () => {
        window.removeEventListener('resize', this.handleResize, true);
    }

    componentDidUpdate = () => {
        if (this.state.randomizeCategoryCount !== this.props.randomizeCategoryCount) {
            this.randomizeCategories();
        }
        if (this.state.randomizeFeaturedCount !== this.props.randomizeFeaturedCount) {
            this.randomizeFeatured();
        }
    }

    handleResize = () => {
        this.setState({ screenWidth: this.myRef.current.offsetWidth });

        this.setState(prevState => { 
            return { pageSize: this.generatePageSize() }
        });
        
    }

    generatePageSize = () => {
        return Math.round((this.myRef.current.offsetWidth - 100) / 200);
    }    

    // API setup code based on: https://gist.github.com/mikecrittenden/28fe4877ddabff65f589311fd5f8655c
    kickoffYouTubeApi = () => {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/client.js";
    
        script.onload = () => {
          window.gapi.load('client', () => {
            window.gapi.client.setApiKey(YOUTUBE_API_KEY);
            window.gapi.client.load('youtube', 'v3', () => {
                console.log('[API] YouTube API loaded');
              this.setState({ youTubeGapiReady: true });
              this.getYouTubeVideoCategoryData();
            });
          });
        };
    
        document.body.appendChild(script);
    }

    getYouTubeVideoCategoryData() {
        let self = this;

        window.gapi.client.youtube.videoCategories.list({
            "part": "snippet",
            "regionCode": "US"
            })
                .then(function(response) {
                        // Handle the results here (response.result has the parsed body).
                        console.log('[YouTube API] Video categories loaded');
                        // console.log(response.result.items);
                        // let shuffledCategories = self.shuffleArray([...response.result.items]);
                        // console.log(shuffledCategories);
                        self.setState({ youTubeVideoCategories: response.result.items });
                        self.getYouTubeMostPopularVideosData( response.result.items );
                        self.getYouTubeMostPopularIndividualVideos();
                    },
                    function(err) { 
                        console.log('[YouTube API Error] Video Category Load Error');
                        console.error("Execute error", err); 
                        if (!self.state.youTubeFailureToLoad) {
                            self.setState({ youTubeFailureToLoad: true });
                        }
                    });
    }

    getYouTubeMostPopularVideosData(videoCategories) {
        let self = this;

        self.setState({ youTubeCategoryLoadsBack: 0 });

        // Limiting the length we iterate through to avoid unnecessary API calls during development
        for(let i=0; i < videoCategories.length; i++) {
        // for(let i=0; i < videoCategories.length; i++) {
            window.gapi.client.youtube.videos.list({
                "part": "snippet", // Removed contentDetails, statistics for quota purposes
                "chart": "mostPopular",
                "regionCode": "US",
                "videoCategoryId": videoCategories[i].id,
                "maxResults": self.state.youTubeNumVideosToLoad
                })
                    .then(function(response) {
                        // console.log(response);
                            // Handle the results here (response.result has the parsed body).
                            // console.log("Response", response.result.items);
                            self.setState(prevState => {
                                return { youTubeCategoryLoadsBack: prevState.youTubeCategoryLoadsBack + 1 };
                            })
                            console.log('[YouTube API] Most popular videos by category loaded');
                            if(response.result.items.length > 0) {
                                const currentMostPopular = {...self.state.youTubeMostPopularVideosByCategory};
                                currentMostPopular[videoCategories[i].id] = response.result.items;

                                self.setState({ youTubeMostPopularVideosByCategory: currentMostPopular});
                            }
                        },
                        function(err) { 
                            console.log('[YouTube API Error] Category Videos Load Error');
                            console.error("Execute error", err); 
                            // Don't mark as a failure to load if a single video list from a category fails
                            self.setState(prevState => {
                                return { youTubeCategoryLoadsBack: prevState.youTubeCategoryLoadsBack + 1 };
                            })
                        });
        }
    }

    getYouTubeMostPopularIndividualVideos() {
        let self = this;

        window.gapi.client.youtube.videos.list({
            "part": "snippet", // Removed contentDetails, statistics for quota purposes
            "chart": "mostPopular",
            "regionCode": "US",
            "maxResults": Math.max(this.state.youTubeNumFeaturedToLoad,3)
            })
                .then(function(response) {
                    console.log('[YouTube API] Most popular individual videos loaded');
                    // console.log('Most popular individual videos: ');
                    // console.log(response.result.items);
                    // Handle the results here (response.result has the parsed body).
                    if(response.result.items.length > 0) {
                        self.setState({ 
                            youTubeMostPopularIndividualVideos: response.result.items
                        });
                    }
                }, 
                    function(err) { 
                        console.log('[YouTube API Error] Individual Videos Load Error');
                        console.error("Execute error", err); 
                        if (!self.state.youTubeFailureToLoad) {
                            self.setState({ youTubeFailureToLoad: true });
                        }
                    });
    }

    toggleVideoPlayer = ( videoId ) => {
        this.setState(prevState => {
            if (prevState.playVideo === true) {
                return { playVideo: false, videoToPlay: null }
            } else {
                return { playVideo: !prevState.playVideo, videoToPlay: videoId }
            }
        })
    }

    randomizeCategories = () => {
        if(this.state.appVideoCategories)  {
            this.setState({randomizeCategoryCount: this.props.randomizeCategoryCount});
            let newVideoCategories = this.shuffleArray([...this.state.appVideoCategories]);
            this.setState({appVideoCategories: newVideoCategories});
        }
    }

    shuffleArray(array) {
        let newArray = [...array]
        // From: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }

        return newArray;
    }

    randomizeFeatured = () => {
        if(this.state.appMostPopularIndividualVideos)  {
            this.setState({randomizeFeaturedCount: this.props.randomizeFeaturedCount})
            const priorFeatured = this.state.featuredVideo;
            let featuredVideo = priorFeatured;

            while (priorFeatured === featuredVideo) {
                featuredVideo = Math.floor(Math.random()*this.state.appMostPopularIndividualVideos.length);
            }
            
            this.setState({ featuredVideo: featuredVideo});
        } else {
            let featuredVideo = Math.floor(Math.random()*3); // YouTube API function is guaranteed to always get at least 3 individual videos
            this.setState({ featuredVideo: featuredVideo });
        }
    }

    getAllDatabaseData = () => {
        this.getDatabaseVideoCategoriesData();
        this.getDatabaseMostPopularVideosByCategoryData();
        this.getDatabaseMostPopularIndividualVideos();
    }

    getDatabaseVideoCategoriesData = () => {
        axios.get('https://react-burger-builder-83547.firebaseio.com/videoCategories.json')
            .then(response => {
                console.log('[Firebase] Received videoCategories data');
                const latestVideoCategories = response.data[Object.keys(response.data).reverse()[0]];
                this.setState({databaseVideoCategories: latestVideoCategories});
                this.setState({appVideoCategories: latestVideoCategories});
            })
            .catch(error => {
                console.log('[Firebase] Failed to receive videoCategories data');
                if (!this.state.appFailureToLoad) {
                    this.setState({ appFailureToLoad: true });
                }
            });
    }

    getDatabaseMostPopularVideosByCategoryData = () => {
        axios.get('https://react-burger-builder-83547.firebaseio.com/mostPopularVideosByCategory.json')
            .then(response => {
                console.log('[Firebase] Received mostPopularVideosByCategory data');
                const mostPopularVideosByCategory = response.data[Object.keys(response.data).reverse()[0]];
                this.setState({databaseMostPopularVideosByCategory: mostPopularVideosByCategory});
                this.setState({appMostPopularVideosByCategory: mostPopularVideosByCategory});

            })
            .catch(error => {
                console.log('[Firebase] Failed to receive mostPopularVideosByCategory data');
                if (!this.state.appFailureToLoad) {
                    this.setState({ appFailureToLoad: true });
                }
            });
    }

    getDatabaseMostPopularIndividualVideos = () => {
        axios.get('https://react-burger-builder-83547.firebaseio.com/mostPopularIndividualVideos.json')
            .then(response => {
                console.log('[Firebase] Received mostPopularIndividualVideos data');
                const mostPopularIndividualVideos = response.data[Object.keys(response.data).reverse()[0]];
                this.setState({databaseMostPopularIndividualVideos: mostPopularIndividualVideos});
                this.setState({appMostPopularIndividualVideos: mostPopularIndividualVideos});
            })
            .catch(error => {
                console.log('[Firebase] Failed to receive mostPopularIndividualVideos data');
                if (!this.state.appFailureToLoad) {
                    this.setState({ appFailureToLoad: true });
                }
            });
    }

    logYouTubeData = () => {
        if (this.state.youTubeVideoCategories && this.state.youTubeCategoryLoadsBack < this.state.youTubeVideoCategories.length) {
            console.log('Still waiting for YouTube category API calls back. '
                + this.state.youTubeCategoryLoadsBack + ' back out of ' + this.state.youTubeVideoCategories.length + ' calls made.');
        } else {
            console.log('[Logging] YouTube Video Categories:');
            console.log(this.state.youTubeVideoCategories);
            console.log('[Logging] YouTube Most Popular Videos by Category:');
            console.log(this.state.youTubeMostPopularVideosByCategory);
            console.log('[Logging] YouTube Most Popular Individual Videos:');
            console.log(this.state.youTubeMostPopularIndividualVideos);
        }
        
    }

    postYouTubeData = () => {
        if (this.state.youTubeVideoCategories
            && this.state.youTubeMostPopularVideosByCategory
            && this.state.youTubeMostPopularIndividualVideos
            && !this.state.youTubeFailureToLoad
            && this.state.youTubeCategoryLoadsBack === this.state.youTubeVideoCategories.length
            ) {
                this.postYouTubeVideoCategoriesData();
                this.postYouTubeMostPopularVideosByCategoryData();
                this.postYouTubeMostPopularIndividualVideos();
        } else {
            console.log("[Firebase] Cannot post YouTube data, because it isn't fully loaded.");
        }
    }

    postYouTubeVideoCategoriesData = () => {
        axios.post('/videoCategories.json', this.state.youTubeVideoCategories)
            .then(response => {
                console.log('[Firebase] Posted youTubeVideoCategories');
                console.log(response);
            })
            .catch(error => {
                console.log('[Firebase Error] Could not post youTubeVideoCategories');
            });
    }

    postYouTubeMostPopularVideosByCategoryData = () => {
        axios.post('/mostPopularVideosByCategory.json', this.state.youTubeMostPopularVideosByCategory)
            .then(response => {
                console.log('[Firebase] Posted youTubeMostPopularVideosByCategory');
                console.log(response);
            })
            .catch(error => {
                console.log('[Firebase Error] Could not post youTubeMostPopularVideosByCategory');
            });
    }

    postYouTubeMostPopularIndividualVideos = () => {
        axios.post('/mostPopularIndividualVideos.json', this.state.youTubeMostPopularIndividualVideos)
            .then(response => {
                console.log('[Firebase] Posted youTubeMostPopularIndividualVideos');
                console.log(response);
            })
            .catch(error => {
                console.log('[Firebase Error] Could not post youTubeMostPopularIndividualVideos');
            });
    }

    toggleYouTubeRefresh = () => {
        this.setState(prevState => {
            return { showYouTubeRefresh: !prevState.showYouTubeRefresh };
        });
    }

    render() {
        let mainView = <div className={classes.Loading}><br/><br/>Loading Tubeflix...</div>;

        if (this.state.appFailureToLoad) {
            mainView = (
                <div>
                    {/* <div className={classes.Failure}><br/><br/>Daily YouTube Usage Quota Exceeded</div>
                    <p className={classes.CheckBack}>
                        Individual developer accounts have a relatively low API usage quota, and this is a data-heavy app.
                        <br/>You can check back after midnight PST to see the app live again. */}
                    <div className={classes.Failure}><br/><br/>Failure to Load Video Data</div>
                    <p className={classes.CheckBack}>
                        Tubeflix was unable to load the video data. Check your internet connection and try refreshing the page.
                    </p>
                </div>
            );
            
        }

        let videoModal = null;

        if (this.state.playVideo) {
            videoModal = <Modal video={this.state.videoToPlay} clicked={this.toggleVideoPlayer}/>
        }

        if (this.state.appVideoCategories && this.state.appMostPopularVideosByCategory && this.state.appMostPopularIndividualVideos && !this.state.appFailureToLoad) {
            mainView = (
                <div>
                    <FeaturedVideo 
                        video={this.state.appMostPopularIndividualVideos[this.state.featuredVideo]} 
                        screenWidth={this.state.screenWidth}
                        videoClicked={this.toggleVideoPlayer}
                    />
                    <VideoCategories 
                        categories={this.state.appVideoCategories}
                        videos={this.state.appMostPopularVideosByCategory}
                        videoClicked={this.toggleVideoPlayer}
                        pageSize={this.state.pageSize}
                        maxCategories={this.state.maxCategoriesToShow}
                    />
                </div>
            );
        }

        let youTubeRefresh = null;

        if (this.state.showYouTubeRefresh) {
            youTubeRefresh = (
                <div className={classes.YouTubeRefreshContainer}>
                    <div className={classes.YouTubeRefreshRow}>
                        Note: Due to quota limits on the YouTube API for individual developers, this can only be run a few times per day. Click left to right and watch the console.
                        </div>
                    <div className={classes.YouTubeRefreshRow}>
                        <button className={classes.YouTubeRefreshButton} onClick={this.kickoffYouTubeApi}>Load YouTube API Data</button>
                        <button className={classes.YouTubeRefreshButton} onClick={this.logYouTubeData}>Log YouTube Data</button>
                        <button className={classes.YouTubeRefreshButton} onClick={this.postYouTubeData}>Post YouTube Data to Firebase</button>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <div className={classes.MainView} ref={this.myRef}>
                    {mainView}
                    <div className={classes.YouTubeRefreshToggle} onClick={this.toggleYouTubeRefresh} />
                    {youTubeRefresh}
                </div>
                {videoModal}
            </div>
        );
    }
}

export default MainView;