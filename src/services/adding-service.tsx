import axios from "axios";

const baseUrl = "http://localhost:8080/api/v1";




export const add = (playerLogoUrl: string, playerFullName: string,transferFeeInMillions: number, fromTeam: string,fromTeamLogoUrl:string, toTeam: string, toTeamLogoUrl: string, numberOfLikes: number) => {
  return axios.post(`${baseUrl}/transfers`, {playerLogoUrl, playerFullName,transferFeeInMillions, fromTeam,fromTeamLogoUrl, toTeam,toTeamLogoUrl },{
    headers:{
      'Authorization' : `Bearer ${localStorage.getItem('token')}`
    }
  });
};
export const addComment = (transferId:number ,comment: string, numberOfLikes: number) => {
  return axios.post(`${baseUrl}/transfers/${transferId}/comments`, {comment,numberOfLikes},{
    headers:{
      'Authorization' : `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const update = (id: number, playerLogoUrl: string, playerFullName: string,transferFeeInMillions: number, fromTeam: string,fromTeamLogoUrl:string, toTeam: string, toTeamLogoUrl: string, numberOfLikes: number) => {
  return axios.put(`${baseUrl}/transfers/${id}`, {playerLogoUrl, playerFullName,transferFeeInMillions, fromTeam,fromTeamLogoUrl, toTeam,toTeamLogoUrl,numberOfLikes},{
    headers:{
      'Authorization' : `Bearer ${localStorage.getItem('token')}`
    }
  });
};
export const remove = (id: number) => {
  return axios.delete(`${baseUrl}/transfers/${id}`,{
    headers:{
      'Authorization' : `Bearer ${localStorage.getItem('token')}`
    }
  });
};
export const removeComment = (transferId: number, commentId: number) => {
  return axios.delete(`${baseUrl}/transfers/${transferId}/comments/${commentId}`,{
    headers:{
      'Authorization' : `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const addingService = {add,addComment, update, remove}
export default addingService;