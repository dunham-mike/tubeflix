import React from 'react';

import VideoCategory from './VideoCategory/VideoCategory';

const videoCategories = ( props ) => {
    // console.log('Categories:');
    // console.log(props.categories);

    let transformedCategories = [...props.categories]
        .filter(category => { // Filter out categories that don't have any videos
            return category.id in props.videos;
        })
        .map(category => { // Transform remaining categories into JSX elements
            let videosInThisCategory = props.videos[category.id];
            // console.log('Category key: ' + category.id);

            return (
                    <VideoCategory 
                        key={category.id}
                        title={category.snippet.title} 
                        videos={videosInThisCategory}
                        videoClicked={props.videoClicked}
                        pageSize={props.pageSize}
                        />
                );
        })
        .slice(0,props.maxCategories);
    
    // console.log('TransformedCategories:');
    // console.log(transformedCategories);

    return (
        <div>{transformedCategories}</div>
    );
}

export default videoCategories;