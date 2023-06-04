import axios from "axios";
import {load} from "cheerio";
import type { NextApiRequest, NextApiResponse } from "next"
import {WebSocketServer} from "ws";
const crawl = async (req:NextApiRequest, res:NextApiResponse) => {
    const socket = new WebSocketServer({port:23101});

    let result;
    // 연결 이벤트 처리
    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    // 메시지 이벤트 처리
    socket.onmessage = async event => {
        const url = 'https://sigbtc.pro'; // 크롤링할 사이트 URL

        try {
          const response = await axios.get(url);
          const html = response.data;
      
          // HTML 파싱을 위해 Cheerio 로드
          const $ = load(html);
      
          // 원하는 데이터 추출
          const title = $('title').text();
          const bodyText = $('body').text();
        socket.close()
        
        res.status(200).json({
        html,
        revalidate: 10, // rerun after 10 seconds
        });
        
        } catch (error) {
          console.error('Failed to fetch data from', url, error);
        }
    };

    // 에러 이벤트 처리
    socket.onerror = error => {
      console.error('WebSocket error:', error);
    };

    // 연결 종료 이벤트 처리
    socket.onclose = event => {
      console.log('WebSocket closed:', event);
    };


}


export default crawl;