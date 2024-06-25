import "./PlayVideo.css";
import video1 from "../../assets/video.mp4";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import jack from "../../assets/jack.png";
import user_profile from "../../assets/user_profile.jpg";
import{API_KEY,value_converter} from '../../data'
import moment from 'moment'
import { useState, useEffect } from "react";

const PlayVideo = ({ videoId }) => {
  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);

 
    const fetchVideoData = async () => {
      const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;

      const response = await fetch(videoDetails_url);
      // 移除错误处理，直接处理正常情况
      const data = await response.json();
      setApiData(data.items[0]);
    };


    const fetchChannelData = async () => {
      const channelDetails_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${apiData?.snippet.channelId}&key=${API_KEY}`;

      await fetch(channelDetails_url)
        .then((res) => res.json())
        .then((data) => setChannelData(data.items[0]));
      
      const comment_url = ` https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${API_KEY}`;
      await fetch(comment_url).then((res) => res.json()).then((data) => setCommentData(data.items));
    }
  
    useEffect(() => {
      fetchVideoData();
    }, [videoId]);
    useEffect(() => {
      fetchChannelData();
    }, [apiData]);

  return (
    <div className="play-video">
      <video src={video1} controls autoPlay muted></video>
      {/* <iframe
        src="https://www.youtube.com/embed/jZFaMEqEqEQ"
        title="Create a Crypto Price Tracking App using React JS & CoinGecko API Step by Step tutorial 2024"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe> */}

      <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3>
      <div className="play-video-info">
        <p>
          {apiData ? value_converter(apiData.statistics.viewCount) : "16K"}{" "}
          Views &bull;{" "}
          {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}
        </p>
        <div>
          <span>
            <img src={like} alt="" />
            {apiData ? value_converter(apiData.statistics.likeCount) : "16K"}
          </span>
          <span>
            <img src={dislike} alt="" />
            {apiData ? value_converter(apiData.statistics.dislikeCount) : "2"}
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
        <img
          src={channelData ? channelData.snippet.thumbnails.high.url : ""}
          alt=""
        />
        <div>
          <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
          <span>
            {apiData ? value_converter(apiData.statistics.likeCount) : "1M"}
            Subscribers
          </span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="vid-description">
        <p>
          {apiData
            ? apiData.snippet.description.slice(0, 250)
            : "description here"}
        </p>
        <hr />
        <h4>
          {apiData ? value_converter(apiData.statistics.commentCount) : "111"}
          Comments
        </h4>
        {commentData.map((item, index) => {
          return (
            <div key={index} className="comment">
              <img
                src={item.snippet.topLevelComment.snippet.authorProfileImageUrl}
                alt=""
              />
              <div>
                <h3>
                  {item.snippet.topLevelComment.snippet.authorDisplayName}{" "}
                  <span>ds</span>{" "}
                </h3>

                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                <div className="comment-action">
                  <img src={like} alt="" />
                  <span>
                    {value_converter(
                      item.snippet.topLevelComment.snippet.likeCount
                    )}
                  </span>
                  <img src={dislike} alt="" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayVideo;
