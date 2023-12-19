import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const baseUrl = "http://localhost:8080/api/v1";

const client = axios.create({ baseURL: baseUrl });

//middleware/interceptor:  catch the error => log it and re-throw
const onFailure = (e: any) => {
  //send the e to a log server (Log Rocket/Grafana/analytics service)
  console.log(e);
  throw e;
};

const onSuccess = (res: AxiosResponse) => {
  //do what you want before chaining:
  //count the requests
  return res;
};

/**
 *
 * @param config - example: request({url:"/home"})
 * @returns Promise<AxiosResponse> - example: request({url:"/home"}).then().catch()
 *
 */
export const request = (config: AxiosRequestConfig) => {
  //read the data from localstorage: (string)
  const userData = localStorage.getItem("user") ?? `{token:''}`;
  //parse
  const user = JSON.parse(userData);
  //get the token from the user:
  const token = user.token;
  

  //include the Authorization header in each request
  client.defaults.headers.common.Authorization = `Bearer ${token}`;
  return client(config).catch(onFailure).then(onSuccess);
};