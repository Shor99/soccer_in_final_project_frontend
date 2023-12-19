import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query';
import SoccerinContext from '../context/SoccerinContext';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { request } from '../utils/axios_interceptors';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import addingService, { removeComment } from '../services/adding-service';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import Swal from 'sweetalert2';
import soccerInService from '../services/soccerin-service';
import { Comment } from '../@Types';
import { GoTrash } from "react-icons/go";

const Comments = () => {
  const nav = useNavigate();
  const [searchparams] = useSearchParams();
  const id = Number(searchparams.get("id"));
  const username = String(localStorage.getItem("username"));
  const playersLogoUrl = String(searchparams.get("playersLogoUrl"));
  const playerFullName = searchparams.get("playerFullName");
  const transferFeeInMillions = Number(searchparams.get("transferFeeInMillions")) < 1 ? (Number(searchparams.get("transferFeeInMillions")) === -1 ? "Loan" : "Free Transfer") : Number(searchparams.get("transferFeeInMillions"));
  const fromTeamLogoUrl = String(searchparams.get("fromTeamLogoUrl"));
  const fromTeam = searchparams.get("fromTeam");
  const toTeamLogoUrl = String(searchparams.get("toTeamLogoUrl"));
  const toTeam = searchparams.get("toTeam");
  const navigate = useNavigate();
  const { setComments } = useContext(SoccerinContext);
  const { data: res } = useQuery("get-comments", () => request({ url: `transfers/${id}/comments` }));
  const [screenComments, setScreenComments] = useState<Array<Comment>>([]);
  const intiailValues = {
    comment: "",
  };

  function onDelete(commentId: number) {
    removeComment(id,commentId)
      .then(() => {
        localStorage.setItem("current-page", "transfers");
        const update = [...screenComments].filter(comment => comment.id !== commentId);
        setScreenComments(update);
      }
      )
  }
  function onAdd(transferId: number, comment: string, numberOfLikes: number) {
    addingService.addComment(
      transferId, comment, numberOfLikes
    ).then((res) => {
      screenComments.push(res.data);
      console.log(screenComments);
    }).then(()=>{
      nav({
        pathname: "",
        search: createSearchParams({
          id: String(id),
          playersLogoUrl: String(playersLogoUrl),
          playerFullName: String(playerFullName),
          transferFeeInMillions: String(transferFeeInMillions),
          fromTeamLogoUrl: String(fromTeamLogoUrl),
          fromTeam: String(fromTeam),
          toTeamLogoUrl: String(toTeamLogoUrl),
          toTeam: String(toTeam)
        }).toString()
      })
    })
  }
  function onLiked(username: string, transferId: number, commentId: number, numberOfLikes: number, comment: string) {
    soccerInService.updateCommentNumberOfLikes(
      username, transferId, commentId, numberOfLikes, comment
    ).then((res) => {
      const update = screenComments.map(comment => {
        if (comment.id === commentId) {
          if ((localStorage.getItem(`comment${commentId}LikedBy${username}`) === "true")) {
            return { ...comment, numberOfLikes: res.data.numberOfLikes++ };
          }
          else if (numberOfLikes > 0) {
            return { ...comment, numberOfLikes: res.data.numberOfLikes-- };
          }
        }
        return comment;
      });
      setScreenComments(update);
    })
  }
  useEffect(() => {
    if (res && res.data) {
      setComments(res.data);
      setScreenComments(res.data);
    }
  }, [res]);

  return (
    <div className="h-full p-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-500 dark:border-gray-700 mt-10 me-64 ms-64"
        key={id}>
        <div>
          <button className="pt-6 ps-6"
            onClick={() => {
              navigate("/transfers")
              localStorage.setItem("current-page", "transfers");
            }
            }>
            <FaArrowLeft />
          </button>
        </div>

        <div className="flex flex-col items-center pb-10">
          <img className="w-24 h-24 mt-3 mb-3 rounded-full shadow-lg" src={playersLogoUrl} alt="" />
          <div className="sm: text-center">
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-black">{playerFullName}</h5>
            <h6 className="mb-1 text-sm font-medium text-gray-900 dark:text-black">Trasfer Fee: {transferFeeInMillions}</h6>
            <span className="text-sm text-gray-500 dark:text-gray-400"></span>
            <ul className="flex mt-10 space-x-7">
              <li>
                <ul>
                  <li><img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={fromTeamLogoUrl} alt="" /></li>
                  <li className="w-24 h-24">{fromTeam}</li>
                </ul>
              </li>
              <li className="mt-10">
                <FaArrowRight />
              </li>
              <li>
                <ul>
                  <li><img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={toTeamLogoUrl} alt="" /></li>
                  <li className="w-24 h-24">{toTeam}</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {screenComments.map(comments => (
        <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-500 dark:border-gray-700 mt-10 me-64 ms-64"
          key={comments.id}>
          <div className="flex flex-col">
            <div className="sm: text-start grid grid-cols-2 ps-2 pb-8 gap-2">
              <div className="flex gap-2 align-middle items-center">
                <img className="w-7 h-7" src={comments.user.profileLogoUrl} alt="" />
                <h6 className="mb-1 text-sm font-medium text-gray-900 dark:text-black">
                  {comments.user.username}
                </h6>
              </div>
              <div className="text-end">
                  {localStorage.getItem("role") === "Admin" && <button className="pt-2 pe-2"
                    onClick={() =>
                      onDelete(comments.id)
                    }>
                    <GoTrash size={22} />
                  </button>}
                </div>
            </div>
            <div className="sm: text-center pb-8">
              <p className="mb-1 italic text-sm font-medium text-gray-900 dark:text-black">" {comments.comment} "</p>
            </div>
            <div className="flex justify-end gap-4 pe-4 pb-4">
              <div className="align-middle items-center justify-center">
                <p className="text-xs text-center">{(comments.numberOfLikes === undefined ? 0 : comments.numberOfLikes)}</p>
                <button className="pb-5"
                  onClick={() => {
                    localStorage.setItem(`comment${comments.id}LikedBy${username}`, (((localStorage.getItem(`comment${comments.id}LikedBy${username}`) === null) || (localStorage.getItem(`comment${comments.id}LikedBy${username}`) === "false")) ? "true" : "false"));
                    onLiked(comments.user.username, id, comments.id, comments.numberOfLikes, comments.comment);
                    nav({
                      pathname: "",
                      search: createSearchParams({
                        id: String(id),
                        playersLogoUrl: String(playersLogoUrl),
                        playerFullName: String(playerFullName),
                        transferFeeInMillions: String(transferFeeInMillions),
                        fromTeamLogoUrl: String(fromTeamLogoUrl),
                        fromTeam: String(fromTeam),
                        toTeamLogoUrl: String(toTeamLogoUrl),
                        toTeam: String(toTeam)
                      }).toString()
                    })
                  }}
                >
                  {(localStorage.getItem(`comment${comments.id}LikedBy${username}`) === "true") ? <div className="text-red-600"><AiFillHeart /></div> : <div><AiOutlineHeart /></div>}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <Formik
        initialValues={intiailValues}
        onSubmit={({ comment }) => {
          onAdd(id, comment, 0);
          localStorage.setItem("current-page", `/transfers/${id}/comments`);
          window.location.reload();
        }}
      >
        <Form>
          <div className="bg-white dark:bg-gray-600  mt-10 me-64 ms-64">
            <div className="font-extralight text-lg  my-2 form-group  gap-1 flex flex-col">
              <label htmlFor="username"></label>

            </div>
            <div className="font-extralight text-lg my-2 form-group  gap-2 flex flex-col">
              <label htmlFor="comment">text:</label>
              <Field
                className=" px-2 py-1 rounded-md border-gray-300 dark:border-gray-700 border-2 bg-white dark:bg-gray-300"
                placeholder="put comment here..."
                name="comment"
                type="text"
                id="comment"
              />
              {/* error message for the input */}
              <ErrorMessage
                name="comment"
                component="div"
                className="text-red-500"
              />
            </div>


            <button
              className="disabled:bg-gray-700/50 rounded dark:text-white px-3 py-2 w-full dark:bg-gray-700 bg-gray-300 text-black"
            >
              Add Comment
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  )
}
export default Comments