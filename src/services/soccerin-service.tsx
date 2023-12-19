import axios from "axios";
import { request } from "../utils/axios_interceptors";
const baseUrl = "http://localhost:8080/api/v1";


export const transferRequest = () => request({ url: `/transfers/page?pageSize=10&pageNo=${localStorage.getItem("transfer_page_number")}`});
export const profileLogoRequest = () => request({ url: "/users/profile_logos" });

export const playerSearchedRequest = () => request({ url: `/transfers/searchByName?playerFullName=${localStorage.getItem("searched-player")}`});
export const teamSearchedRequest = () => request({ url: `/transfers/searchByTeam?teamName=${localStorage.getItem("searched-team")}`});
export const rangeSearchRequest = () => request({ url: `/transfers/searchByTransferFeeRange?rangeFrom=${localStorage.getItem("range-search-from")}&rangeTo=${localStorage.getItem("range-search-to")}`});
export const updatedTransfers = () => request({ url: `/transfers/${localStorage.getItem("transferUpdted")}`});

export const updateCommentNumberOfLikes = (username: String, transferId: number, commentId: number, numberOfLikes: number, comment: String) => {
  if (localStorage.getItem(`comment${commentId}LikedBy${username}`) === "true") {
    numberOfLikes++;
  }
  else if (numberOfLikes > 0) {
    numberOfLikes--;
  }
  return axios.put(`${baseUrl}/transfers/${transferId}/comments/${commentId}`, { comment, numberOfLikes }, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
}

export const updateTransferNumberOfLikes = (username: String, id: number, playerLogoUrl: string, playerFullName: string,transferFeeInMillions: number, fromTeam: string,fromTeamLogoUrl:string, toTeam: string, toTeamLogoUrl: string, numberOfLikes: number) => {
  if (localStorage.getItem(`transfer${id}LikedBy${username}`) === "true") {
    numberOfLikes++;
  }
  else if (numberOfLikes > 0) {
    numberOfLikes--;
  }
  return axios.put(`${baseUrl}/transfers/${id}`, {playerLogoUrl, playerFullName,transferFeeInMillions, fromTeam,fromTeamLogoUrl, toTeam,toTeamLogoUrl,numberOfLikes},{
    headers:{
      'Authorization' : `Bearer ${localStorage.getItem('token')}`
    }
  })
}

const soccerInService = { updateCommentNumberOfLikes , updateTransferNumberOfLikes}
export default soccerInService;



