import React, { useEffect, useState } from 'react'
import './Recommended.css'
import { Link } from 'react-router-dom'

const Recommended = ({categoryId}) => {

    const [apiData,setApiData] = useState([]);

    const fetchData = async () => {
        //Fetching recommended videos data
        try {
            const relatedVideo_url =`/api/youtube/v3/videos?part=snippet%2CcontentDetails2Cstatistics&chart=mostPopular&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`
            const response = await fetch(relatedVideo_url_url);
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          const data = await response.json();
          setApiData(data.items);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }

    useEffect(()=>{
        fetchData();
    })

  return (
    <div className='recommended'>
        {apiData.map((item,index)=>{
            return(
                <Link to={`/video/${item.snippet.categoryId}/${item.id}`} key={index} className="side-video-list">
                    <img src={item.snippet.thumbnails.medium.url} alt="" />
                    <div className="vid-info">
                        <h4>{item.snippet.title}</h4>
                        <p>{item.snippet.channelTitle}</p>
                        <p>{numeral(item.statistics.viewCount).format('0.0a').toUpperCase()} views</p>
                    </div>
                </Link>
            )
        })}
        
    </div>
  )
}

export default Recommended