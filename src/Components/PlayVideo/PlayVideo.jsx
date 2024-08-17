import React, { useEffect, useState } from 'react'
import './PlayVideo.css'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import { API_KEY } from '../../data'
import moment from 'moment'
import numeral from 'numeral'
import { useParams } from 'react-router-dom'

const PlayVideo = () => {

    const {videoId} = useParams();

    const [apiData,setApiData] = useState(null);
    const [channelData,setChannelData] = useState(null);
    const [commentsData,setCommentsData] = useState([]);

    const fetchVideoData = async () => {
        //Fetching Videos data
        try {
            const videoDetails_url =`/api/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`
            const response = await fetch(videoDetails_url);
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          const data = await response.json();
          setApiData(data.items[0]);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    const fetchOtherData = async () => {
        //Fetching Channel data
        try {
            const channelData_url =`/api/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`
            const response = await fetch(channelData_url);
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          const data = await response.json();
          setChannelData(data.items[0]);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }

    const fetchCommentsData = async () => {
        //Fetching Channel data
        try {
            const commentsData_url =`/api/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${API_KEY}`
            const response = await fetch(commentsData_url);
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          const data = await response.json();
          setCommentsData(data.items);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchVideoData();
    },[videoId]);

    useEffect(() => {
        if (apiData) {
            fetchOtherData();
        }
    },[apiData]);

    useEffect(() => {
        fetchCommentsData();
    },[videoId]);
    console.log(fetchCommentsData());

    return (
        <div className='play-video'>
            <iframe  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"  referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            <h3>{apiData?apiData.snippet.title:"Title Here"}</h3>
            <div className="play-video-info">
                <p>{apiData?numeral(apiData.statistics.viewCount).format('0.0a').toUpperCase():"16K"} Views &bull; {apiData?moment(apiData.snippet.publishedAt).fromNow(): ""}</p>
                <div>
                    <span>
                        <img src={like} alt="" />
                        {apiData?numeral(apiData.statistics.likeCount).format('0.0a').toUpperCase():155}
                    </span>
                    <span>
                        <img src={dislike} alt="" />
                        
                    </span>
                    <span>
                        <img src={share} alt="" />
                        Share
                    </span>
                    <span>
                        <img src={save} alt="" />
                        Save
                    </span>
                </div>
            </div>
            <hr />
            <div className="publisher">
                <img src={channelData?channelData.snippet.thumbnails.default.url:""} alt="" />
                <div>
                    <p>{apiData?apiData.snippet.channelTitle:""}</p>
                    <span>{channelData?numeral(channelData.statistics.subscriberCount).format('0.0a').toUpperCase():""} subscribers</span>
                </div>
                <button>Subscribe</button>
            </div>
            <div className="vid-description">
                <p>{apiData?apiData.snippet.description.slice(0,250):"Description Here"}</p>
                <hr />
                <h4>{apiData?numeral(apiData.statistics.commentCount).format('0.0a').toUpperCase():""} Comments</h4>
                {commentsData.map((item,index)=>{
                    return(
                        <div key={index} className="comment">
                            <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
                            <div>
                                <h3>{item.snippet.topLevelComment.snippet.authorDisplayName} 
                                    <span>
                                        {moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}
                                    </span>
                                </h3>
                                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                                <div className="comment-action">
                                    <img src={like} alt="" />
                                    <span>{numeral(item.snippet.topLevelComment.snippet.likeCount).format('0a').toUpperCase()}</span>
                                    <img src={dislike} alt="" />
                                </div>
                            </div>
                        </div>
                    )
                })}
                
                
            </div>
        </div>
    )
}

export default PlayVideo