import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import addingService from '../services/adding-service';
import Swal from 'sweetalert2';
import Spinner from '../components/spinner/Spinner';

function Updating() {
    const nav = useNavigate();
    const [searchparams] = useSearchParams();
    const id = Number(searchparams.get("id"))
    const playersLogoUrl = String(searchparams.get("playersLogoUrl"))
    const playerFullName = String(searchparams.get("playerFullName"))
    const transferFeeInMillions = Number(searchparams.get("transferFeeInMillions"))
    const fromTeamLogoUrl = String(searchparams.get("fromTeamLogoUrl"))
    const fromTeam = String(searchparams.get("fromTeam"))
    const toTeamLogoUrl = String(searchparams.get("toTeamLogoUrl"))
    const toTeam = String(searchparams.get("toTeam"))
    const numerOfLikes = Number(searchparams.get("numerOfLikes"))
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const intiailValues = {
        transferId: id,
        playerLogoUrl: playersLogoUrl,
        playerFullName: playerFullName,
        transferFeeInMillions: transferFeeInMillions,
        fromTeam:fromTeam,
        fromTeamLogoUrl: fromTeamLogoUrl,
        toTeam: toTeam,
        toTeamLogoUrl: toTeamLogoUrl,
        numberOfLikes: numerOfLikes
      };
  return (
      <Formik
        initialValues={intiailValues}
        onSubmit={({transferId, playerLogoUrl, playerFullName, transferFeeInMillions, fromTeam, fromTeamLogoUrl, toTeam ,toTeamLogoUrl}) => {
          setLoading(true); //show progress spinner
          setError(undefined); //new round - clean slate
          addingService
            .update(transferId, playerLogoUrl, playerFullName, transferFeeInMillions, fromTeam, fromTeamLogoUrl, toTeam ,toTeamLogoUrl,numerOfLikes)
            .then(() => {
              Swal.fire({
                title: "Player been added successfully",
                icon: "success",
                timer: 2000,
              });
              //navigate
              nav("/transfers");
              localStorage.setItem("current-page", "transfers");
            })
            .catch((e) => {
              console.log(e.response.data);
              setError(e.response.data.message);
            })
            .finally(() => {
              setLoading(false);
            });
        }}
      >
        <Form className="h-full p-4">
          {loading && <Spinner title="" />}
          {error && (
            <p className="text-red-500 flex justify-center w-fit mx-auto px-10 py-5 mt-4 rounded-3xl italic shadow-md">
              {error}
            </p>
          )}
          <div className="bg-white dark:bg-gray-500 shadow-md rounded-lg my-2 w-1/2 mx-auto p-4 flex flex-col gap-2">
            <div className="font-extralight text-lg  my-2 form-group  gap-1 flex flex-col">
              <label htmlFor="playerLogoUrl">Players logo url:</label>
              {<Field
                className=" px-2 py-1 rounded-md border-gray-700 dark:bg-gray-600 border-2"
                defaultValue={`${playersLogoUrl}`}
                name="playerLogoUrl"
                type="text"
                id="playerLogoUrl"
              />}
              {/* error message for the input */}
              <ErrorMessage
                name="playerLogoUrl"
                component="div"
                className="text-red-500"
              /> 
            </div>
            <div className="font-extralight text-lg  my-2 form-group  gap-1 flex flex-col">
              <label htmlFor="playername">Players name:</label>
              {<Field
                className=" px-2 py-1 rounded-md border-gray-700 dark:bg-gray-600 border-2"
                defaultValue={`${playerFullName}`}
                name="playerFullName"
                type="text"
                id="playerFullName"
              />}
              {/* error message for the input */}
              <ErrorMessage
                name="playerFullName"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="font-extralight text-lg  my-2 form-group  gap-1 flex flex-col">
              <label htmlFor="transferFeeInMillions">Transfer fee in millions(0 for Free Transfer,-1 for Loan Transfer):</label>
              {<Field
                className=" px-2 py-1 rounded-md border-gray-700 dark:bg-gray-600 border-2"
                defaultValue={`${transferFeeInMillions}`}
                name="transferFeeInMillions"
                type="text"
                id="transferFeeInMillions"
              />}
              {/* error message for the input */}
              <ErrorMessage
                name="transferFeeInMillions"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="font-extralight text-lg  my-2 form-group  gap-2 flex flex-col">
              <label htmlFor="fromTeam">team played in:</label>
              {<Field
                className=" px-2 py-1 rounded-md border-gray-700 dark:bg-gray-600 border-2"
                defaultValue={`${fromTeam}`}
                name="fromTeam"
                type="text"
                id="fromTeam"
              />}
              {/* error message for the input */}
              <ErrorMessage
                name="fromTeam"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="font-extralight text-lg  my-2 form-group  gap-2 flex flex-col">
              <label htmlFor="fromTeamLogo">team played in logo url:</label>
              {<Field
                className=" px-2 py-1 rounded-md border-gray-700 dark:bg-gray-600 border-2"
                defaultValue={`${fromTeamLogoUrl}`}
                name="fromTeamLogoUrl"
                type="text"
                id="fromTeamLogoUrl"
              />}
              {/* error message for the input */}
              <ErrorMessage
                name="fromTeamLogo"
                component="div"
                className="text-red-500"
              />
            </div>
  
            <div className="font-extralight text-lg my-2 form-group  gap-2 flex flex-col">
              <label htmlFor="toTeam">team trensfer to:</label>
              {<Field
                className=" px-2 py-1 rounded-md border-gray-700 dark:bg-gray-600 border-2"
                defaultValue={`${toTeam}`}
                name="toTeam"
                type="text"
                id="toTeam"
              />}
              {/* error message for the input */}
              <ErrorMessage
                name="teamTo"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="font-extralight text-lg my-2 form-group  gap-2 flex flex-col">
              <label htmlFor="toTeamLogoUrl">team trensfer to logo url:</label>
              {<Field
                className=" px-2 py-1 rounded-md border-gray-700 dark:bg-gray-600 border-2"
                defaultValue={`${toTeamLogoUrl}`}
                name="toTeamLogoUrl"
                type="text"
                id="toTeamLogoUrl"
              />}
              {/* error message for the input */}
              <ErrorMessage
                name="toTeamLogoUrl"
                component="div"
                className="text-red-500"
              />
            </div>
  
            <button
              disabled={loading}
              type="submit"
              className="disabled:bg-gray-700/50 rounded text-black px-3 py-2 w-full bg-gray-700"
            >
              Update
            </button>
          </div>
        </Form>
      </Formik>
    
  )
}

export default Updating