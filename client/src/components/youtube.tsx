import axios from 'axios';
const KEY = 'AIzaSyCu4aQAXl4n0eAkCJb_HZbovWQ3pdET5tI'; // PUT IN .env FILE

// Default YouTube API url with set parameters
export default axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
  params: {
    part: 'snippet',
    maxResults: 15, // Returns max of 15 videos
    key: KEY,       // API Key
    type: "video"   // Only returns videos
  }
})