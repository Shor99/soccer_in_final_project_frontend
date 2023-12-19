import { ErrorMessage, Field, Form, Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import Spinner from "../components/spinner/Spinner";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import addingService from "../services/adding-service";
import { useQuery } from "react-query";
import { transferRequest } from "../services/soccerin-service";
import SoccerinContext from "../context/SoccerinContext";

function Adding() {
    const nav = useNavigate();
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const { isLoading, data: res } = useQuery("get-transfers", transferRequest);
    const { setTransfers } = useContext(SoccerinContext);
    
  
    const intiailValues = {
      playerLogoUrl: "",
      playerFullName: "",
      transferFeeInMillions: 0,
      fromTeam: "",
      fromTeamLogoUrl: "",
      toTeam: "",
      toTeamLogoUrl: "",
    };
    
  
    return (
        <Formik
        initialValues={intiailValues}
        onSubmit={({playerLogoUrl, playerFullName, transferFeeInMillions, fromTeam, fromTeamLogoUrl, toTeam ,toTeamLogoUrl}) => {
          setLoading(true); //show progress spinner
          setError(undefined); //new round - clean slate
          addingService
            .add(playerLogoUrl, playerFullName, transferFeeInMillions, fromTeam, fromTeamLogoUrl, toTeam ,toTeamLogoUrl,0)
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
          <div className="bg-white dark:bg-gray-500 shadow-md rounded-lg  w-1/2 mx-auto p-4 flex flex-col gap-2">
            <div className="font-extralight text-lg  my-2 form-group  gap-1 flex flex-col">
              <label htmlFor="playerLogoUrl">Players logo url:</label>
              <Field
                className=" px-2 py-1 rounded-md border-blue-300 dark:border-gray-700 dark:bg-gray-600 border-2"
                placeholder="Players logo url..."
                name="playerLogoUrl"
                type="text"
                id="playerLogoUrl"
              />
              {/* error message for the input */}
              <ErrorMessage
                name="playerLogoUrl"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="font-extralight text-lg  my-2 form-group  gap-1 flex flex-col">
              <label htmlFor="playername">Players name:</label>
              <Field
                className=" px-2 py-1 rounded-md border-blue-300 dark:border-gray-700 dark:bg-gray-600 border-2"
                placeholder="Player Full name..."
                name="playerFullName"
                type="text"
                id="playerFullName"
              />
              {/* error message for the input */}
              <ErrorMessage
                name="playerFullName"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="font-extralight text-lg  my-2 form-group  gap-1 flex flex-col">
              <label htmlFor="transferFeeInMillions">Transfer fee in millions(0 for Free Transfer,-1 for Loan Transfer):</label>
              <Field
                className=" px-2 py-1 rounded-md border-blue-300 dark:border-gray-700 dark:bg-gray-600 border-2"
                placeholder="Transfer fee in millions/Loan..."
                name="transferFeeInMillions"
                type="text"
                id="transferFeeInMillions"
              />
              {/* error message for the input */}
              <ErrorMessage
                name="transferFeeInMillions"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="font-extralight text-lg  my-2 form-group  gap-2 flex flex-col">
              <label htmlFor="fromTeam">team played in:</label>
              <Field
                className=" px-2 py-1 rounded-md border-blue-300 dark:border-gray-700 dark:bg-gray-600 border-2"
                placeholder="team played in..."
                name="fromTeam"
                type="text"
                id="fromTeam"
              />
              {/* error message for the input */}
              <ErrorMessage
                name="fromTeam"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="font-extralight text-lg  my-2 form-group  gap-2 flex flex-col">
              <label htmlFor="fromTeamLogo">team played in logo url:</label>
              <Field
                className=" px-2 py-1 rounded-md border-blue-300 dark:border-gray-700 dark:bg-gray-600 border-2"
                placeholder="team played in logo url..."
                name="fromTeamLogoUrl"
                type="text"
                id="fromTeamLogoUrl"
              />
              {/* error message for the input */}
              <ErrorMessage
                name="fromTeamLogo"
                component="div"
                className="text-red-500"
              />
            </div>
  
            <div className="font-extralight text-lg my-2 form-group  gap-2 flex flex-col">
              <label htmlFor="toTeam">team trensfer to:</label>
              <Field
                className=" px-2 py-1 rounded-md border-blue-300 dark:border-gray-700 dark:bg-gray-600 border-2"
                placeholder="team trensfer to..."
                name="toTeam"
                type="text"
                id="toTeam"
              />
              {/* error message for the input */}
              <ErrorMessage
                name="teamTo"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="font-extralight text-lg my-2 form-group  gap-2 flex flex-col">
              <label htmlFor="toTeamLogoUrl">team trensfer to logo url:</label>
              <Field
                className=" px-2 py-1 rounded-md border-blue-300 dark:border-gray-700 dark:bg-gray-600 border-2"
                placeholder="team trensfer to logo url..."
                name="toTeamLogoUrl"
                type="text"
                id="toTeamLogoUrl"
              />
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
              className="disabled:bg-gray-700/50 rounded dark:text-white px-3 py-2 w-full dark:bg-gray-700 bg-gray-300 text-black"
            >
              Add
            </button>
          </div>
        </Form>
      </Formik>
    );
  };

export default Adding