import { useContext, useEffect, useState } from "react";
import Spinner from "../components/spinner/Spinner";
import { useQuery } from "react-query";
import SoccerinContext from "../context/SoccerinContext";
import soccerInService, { playerSearchedRequest, rangeSearchRequest, teamSearchedRequest, transferRequest } from "../services/soccerin-service";
import { FaRegEdit, FaArrowRight, FaArrowLeft, FaComment, FaSearch } from "react-icons/fa";
import { createSearchParams, useNavigate } from "react-router-dom";
import { remove } from "../services/adding-service";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { TiThMenu } from "react-icons/ti";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { GoTrash } from "react-icons/go";
import { Transfer } from "../@Types";

const Transfers = () => {
  const navigate = useNavigate();
  const username = String(localStorage.getItem("username"));
  const { setTransfers } = useContext(SoccerinContext);
  const { isLoading, data: res } = useQuery("get-transfers", transferRequest);
  const [screenTransfers, setScreenTransfers] = useState<Array<Transfer>>([]);
  const { data: resSearchedByPlayer } = useQuery("get-transfersFindByPlayer", playerSearchedRequest);
  const { data: resSearchedByTeam } = useQuery("get-transfersFindByTeam", teamSearchedRequest);
  const { data: resSearchedByRange } = useQuery("get-transfersFindByTransferFeeRange", rangeSearchRequest);
  const [pageNo, setPageNo] = useState<number>(Number(localStorage.getItem("transfer_page_number")));
  const [filtered, isFiltered] = useState<boolean>(false);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const intiailValues = {
    playerFullName: "",
    teamName: "",
    rangeFrom: "",
    rangeTo: "",
    transfer_type: ""
  };
  function onDelete(id: number) {
    remove(id)
      .then(() => {
        localStorage.setItem("current-page", "transfers");
        const update = [...screenTransfers].filter(transfer => transfer.id !== id);
        setScreenTransfers(update);
      }
      )
  }
  function onLiked(username: string, id: number, playerLogoUrl: string, playerFullName: string, transferFeeInMillions: number, fromTeam: string, fromTeamLogoUrl: string, toTeam: string, toTeamLogoUrl: string, numberOfLikes: number) {
    soccerInService.updateTransferNumberOfLikes(
      username, id, playerLogoUrl, playerFullName, transferFeeInMillions, fromTeam, fromTeamLogoUrl, toTeam, toTeamLogoUrl, numberOfLikes
    ).then((res) => {
        const update = screenTransfers.map(transfer => {
          if (transfer.id === id) {
            if((localStorage.getItem(`transfer${id}LikedBy${username}`) === "true")){
              return {...transfer, numberOfLikes: res.data.numberOfLikes++};
            }
            else if (numberOfLikes > 0) {
              return {...transfer, numberOfLikes: res.data.numberOfLikes--};
            }
          }
          return transfer;
        });
        setScreenTransfers(update);
    })
  }
  
  useEffect(() => {
    if (localStorage.getItem("searching_transfer") === "true" && localStorage.getItem("searching_transfer_by_player") === "true" && resSearchedByPlayer && resSearchedByPlayer.data) {
      const data = resSearchedByPlayer.data;
      setTransfers(data);
      setScreenTransfers(data.results);
    }
    else if (localStorage.getItem("searching_transfer") === "true" && localStorage.getItem("searching_transfer_by_team") === "true" && resSearchedByTeam && resSearchedByTeam.data) {
      const data = resSearchedByTeam.data;
      setTransfers(data);
      setScreenTransfers(data.results);
    }
    else if (localStorage.getItem("searching_transfer") === "true" && localStorage.getItem("searching_transfer_by_range") === "true" && resSearchedByRange && resSearchedByRange.data) {
      const data = resSearchedByRange.data;
      setTransfers(data);
      setScreenTransfers(data.results);
    }
    else if (res && res.data) {
      const data = res.data;
      setTransfers(data);
      setScreenTransfers(data.results);
    }
  }, [localStorage.getItem("searching_transfer_by_player") === "true" ? resSearchedByPlayer : localStorage.getItem("searching_transfer_by_team") === "true" ? resSearchedByTeam : localStorage.getItem("searching_transfer_by_range") === "true" ? resSearchedByRange : res]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className={` ${screenTransfers.length > 0  ? "h-full" : "h-screen"}`}>
        <Formik
          initialValues={intiailValues}
          onSubmit={({ playerFullName, teamName, rangeFrom, rangeTo, transfer_type }) => {
            if ((localStorage.getItem("searching_transfer_by_player") === "true") && playerFullName !== "") {
              localStorage.setItem("searched-player", playerFullName);
              localStorage.setItem("searching_transfer", "true")
              window.location.reload();
            }
            else if ((localStorage.getItem("searching_transfer_by_team") === "true") && teamName !== "") {
              localStorage.setItem("searched-team", teamName);
              localStorage.setItem("searching_transfer", "true")
              window.location.reload();
            }
            else if ((localStorage.getItem("searching_transfer_by_range") === "true")) {
              if (transfer_type === "") {
                localStorage.setItem("range-search-from", `${rangeFrom}`);
                localStorage.setItem("range-search-to", `${rangeTo}`);
              }
              else {
                if (transfer_type === "Loan") {
                  localStorage.setItem("range-search-from", `-1`);
                  localStorage.setItem("range-search-to", `-1`);
                }
                else {
                  localStorage.setItem("range-search-from", "0");
                  localStorage.setItem("range-search-to", "0");
                }
              }
              localStorage.setItem("searching_transfer", "true")
              window.location.reload();
            }
          }}
        >
          <Form>
            <div className="dark:bg-gray-600 flex items-center justify-center p-4">
              {((localStorage.getItem("searching_transfer_by_player") === "true") || (localStorage.getItem("searching_transfer_by_range") === "true") || (localStorage.getItem("searching_transfer_by_team") === "true")) && <button
                className="disabled:bg-gray-700/50 rounded-s-md border-2 text-xl border-gray-300 text-black px-2 py-2 bg-gray-200 dark:text-white dark:bg-gray-700 dark:border-gray-900"
                onClick={() => {
                  localStorage.setItem("searching_transfer_by_player", "false");
                  localStorage.setItem("searching_transfer_by_team", "false");
                  localStorage.setItem("searching_transfer_by_range", "false");
                  localStorage.setItem("searching_transfer", "false");
                  setFilterOpen(false);
                  navigate("/transfers");
                }
                }
              >
                <FaArrowLeft />
              </button>}
              <div className="font-extralight w-1/4 text-lg form-group flex flex-col">

                <Field
                  className={`px-2 py-1 shadow-lg' ${((localStorage.getItem("searching_transfer_by_player") === "true") || (localStorage.getItem("searching_transfer_by_range") === "true") || (localStorage.getItem("searching_transfer_by_team") === "true")) ? "" : "rounded-s-md"} border-gray-300 dark:border-gray-700 border-2 bg-white dark:bg-gray-300`}
                  placeholder="Enter player full name here..."
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
              <button
                className="disabled:bg-gray-700/50 border-2 text-xl shadow-lg border-gray-300 text-black px-2 py-2 bg-gray-200 dark:text-white dark:bg-gray-700 dark:border-gray-900"
                onClick={() => {
                  localStorage.setItem("searching_transfer_by_player", "true");
                  localStorage.setItem("searching_transfer_by_team", "false");
                  localStorage.setItem("searching_transfer_by_range", "false");
                  isFiltered(false);
                }
                }
              >
                <FaSearch />
              </button>
              {localStorage.getItem("searching_transfer") === "false" && <button
                className="disabled:bg-gray-700/50 border-2 text-xl shadow-lg rounded-e-md border-gray-300 text-black px-2 py-2 bg-gray-200 dark:text-white dark:bg-gray-700 dark:border-gray-900"
                onClick={() => {
                  localStorage.setItem("searching_transfer_by_team", "false");
                  localStorage.setItem("searching_transfer_by_range", "false");
                  isFiltered(true);
                  setFilterOpen(!filterOpen);
                }
                }
              >
                <TiThMenu />
              </button>}
            </div>
            {filterOpen && <div className="justify-center flex">
              <div className="font-extralight w-2/4 text-lg form-group border-2 border-gray-900 rounded-md flex flex-col">
                <div className="flex p-4 items-center">
                  <label className="pe-3">search by team</label>
                  <Field
                    className="px-2 py-1 shadow-lg rounded-s-md border-gray-300 dark:border-gray-700 border-2 bg-white dark:bg-gray-300"
                    placeholder="Enter team name..."
                    name="teamName"
                    type="text"
                    id="teamName"
                  />
                  {/* error message for the input */}
                  <ErrorMessage
                    name="teamName"
                    component="div"
                    className="text-red-500"
                  />
                  <button
                    onClick={() => {
                      localStorage.setItem("searching_transfer_by_range", "false");
                      localStorage.setItem("searching_transfer_by_player", "false");
                      localStorage.setItem("searching_transfer_by_team", "true");
                    }
                    }
                    className="disabled:bg-gray-700/50 border-2 text-xl shadow-lg rounded-e-md border-gray-300 text-black px-2 py-2 bg-gray-200 dark:text-white dark:bg-gray-700 dark:border-gray-900"
                  >
                    <FaSearch />
                  </button>
                </div>
                <div className="justify-center items-center">
                  <label className="w-3/4">Search by transfer fee in millions euros</label>
                  <div className="flex items-center rounded w-full px-2 py-1 shadow-lg rounded-s-md border-gray-900 dark:border-gray-700 border-2 bg-white dark:bg-gray-600">
                    <label className="dark:text-white p-1">From: </label>
                    <Field
                      className="w-20 px-2 py-1 shadow-lg rounded-md border-gray-300 dark:border-gray-700 border-2 bg-white dark:bg-gray-300"
                      placeholder="From..."
                      name="rangeFrom"
                      type="text"
                      id="rangeFrom"
                    />
                    <label className="dark:text-white p-1">M€</label>
                    <label className="dark:text-white p-1">To: </label>
                    <Field
                      className="w-20 px-2 py-1 shadow-lg rounded-md border-gray-300 dark:border-gray-700 border-2 bg-white dark:bg-gray-300"
                      placeholder="to..."
                      name="rangeTo"
                      type="text"
                      id="rangeTo"
                    />
                    <label className="dark:text-white">M€</label>
                    <label className="dark:text-white ps-8">OR</label>
                    <div className="p-1 ps-8 pe-8">
                      <Field className="px-2 py-1 rounded border-gray-300 dark:border-gray-700 border-2 bg-white dark:bg-gray-300 dark:text-black" as="select" name="transfer_type">
                        <option defaultChecked value="Bought">Choose...</option>
                        <option value="Loan">Loan</option>
                        <option value="FreeTransfer">Free Transfer</option>
                      </Field>
                    </div>
                    <button
                      className="disabled:bg-gray-700/50 border-2 text-xl shadow-lg border-gray-300 text-black px-2 py-2 bg-gray-200 dark:text-white dark:bg-gray-700 dark:border-gray-900"
                      onClick={() => {
                        localStorage.setItem("searching_transfer_by_player", "false");
                        localStorage.setItem("searching_transfer_by_team", "false");
                        localStorage.setItem("searching_transfer_by_range", "true");
                      }}
                    >
                      <FaSearch />
                    </button>
                  </div>
                </div>
              </div>
            </div>}
          </Form>
        </Formik>
        {(resSearchedByPlayer?.data.results.length === 0) && (localStorage.getItem("searching_transfer") === "true") && (localStorage.getItem("searching_transfer_by_player_name") === "true") && <div className="text-center h-screen">
          <p className="pb-10">No Such Player As {localStorage.getItem("searched-player")}</p>
          <button className="bg-gray-500 border border-gray-700 rounded-lg shadow dark:bg-gray-500 dark:border-gray-700 h-10 w-40" onClick={() => {
            setFilterOpen(false);
            navigate('/transfers');
            localStorage.setItem("searching_transfer_by_player", "false");
            localStorage.setItem("searching_transfer_by_team", "false");
            localStorage.setItem("searching_transfer", "false");
          }}>Search Again</button>
        </div>}
        {(resSearchedByTeam?.data.results.length === 0) && (localStorage.getItem("searching_transfer") === "true") && (localStorage.getItem("searching_transfer_by_team") === "true") && <div className="text-center h-screen">
          <p className="pb-10">No Such Team As {localStorage.getItem("searched-team")}</p>
          <button className="bg-gray-500 border border-gray-700 rounded-lg shadow dark:bg-gray-500 dark:border-gray-700 h-10 w-40" onClick={() => {
            setFilterOpen(!filterOpen);
            navigate('');
            localStorage.setItem("searching_transfer_by_player", "false");
            localStorage.setItem("searching_transfer_by_team", "false");
            localStorage.setItem("searching_transfer", "false");
          }}>Search Again</button>
        </div>}
        {localStorage.getItem("searching_transfer") === "false" && <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1">
          {screenTransfers.map(transfer => (
            <div className="p-4">
              <div className="bg-white border border-gray-300 rounded-lg shadow-xl dark:bg-gray-500 dark:border-gray-700"
                key={transfer.id}>
                <div className="text-end">
                  {localStorage.getItem("role") === "Admin" && <button className="pt-2 pe-2"
                    onClick={() =>
                      onDelete(transfer.id)
                    }>
                    <GoTrash size={22} />
                  </button>}
                </div>
                <div className="flex flex-col items-center pb-10">
                  <img className="w-24 h-24 mt-3 mb-3 rounded-full shadow-lg" src={transfer.playerLogoUrl} alt="" />
                  <div className="sm: text-center">
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-black">{transfer.playerFullName}</h5>
                    <h6 className="mb-1 text-sm font-medium text-gray-900 dark:text-black">
                      Trasfer Fee: {transfer.transferFeeInMillions === 0 || transfer.transferFeeInMillions === -1 ? (transfer.transferFeeInMillions === -1 ? "Loan" : "Free Transfer") : `${transfer.transferFeeInMillions}M€`}
                    </h6>
                    <span className="text-sm light:text-gray-500 dark:text-gray-400"></span>
                    <ul className="flex mt-10 space-x-7">
                      <li>
                        <ul>
                          <li><img className="w-32 h-32 mb-3 rounded-full shadow-lg" src={transfer.fromTeamLogoUrl} alt="" /></li>
                          <li className="w-32 h-32">{transfer.fromTeam}</li>
                        </ul>
                      </li>
                      <li className="mt-10">
                        <FaArrowRight size={22} />
                      </li>
                      <li>
                        <ul>
                          <li><img className="w-32 h-32 mb-3 rounded-full shadow-lg" src={transfer.toTeamLogoUrl} alt="" /></li>
                          <li className="w-32 h-32">{transfer.toTeam}</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex gap-2 items-start justify-start align-middle">
                    {transfer.numberOfLikes > 999 && transfer.numberOfLikes < 1000000 ? `${Math.round(transfer.numberOfLikes / 1000)}K`
                      : transfer.numberOfLikes > 999999 && transfer.numberOfLikes < 1000000 ? `${Math.round(transfer.numberOfLikes / 1000000)}M`
                        : transfer.numberOfLikes} People liked the transfer
                  </div>
                  <div className="flex gap-2 items-center justify-center align-middle">

                  </div>
                  <div className="flex gap-2 items-center justify-center align-middle">

                  </div>
                </div>
                <div className="border border-gray-400"></div>
                <div className="grid grid-cols-3 p-3">
                  <div className="flex gap-2 items-center justify-center align-middle">
                    <button
                      onClick={() => {
                        localStorage.setItem(`transfer${transfer.id}LikedBy${username}`, (((localStorage.getItem(`transfer${transfer.id}LikedBy${username}`) === null) || (localStorage.getItem(`transfer${transfer.id}LikedBy${username}`) === "false")) ? "true" : "false"));
                        onLiked(username,
                          transfer.id,
                          transfer.playerLogoUrl,
                          transfer.playerFullName,
                          transfer.transferFeeInMillions,
                          transfer.fromTeam,
                          transfer.fromTeamLogoUrl,
                          transfer.toTeam,
                          transfer.toTeamLogoUrl,
                          (transfer.numberOfLikes === undefined) ? 0 : transfer.numberOfLikes)
                        navigate("/transfers");
                      }}
                    >
                      {(localStorage.getItem(`transfer${transfer.id}LikedBy${username}`) === "true") ? <div className="text-red-600"><AiFillHeart size={22} /></div> : <div><AiOutlineHeart size={22} /></div>}
                    </button>
                    <p>Like</p>
                  </div>
                  <div className="flex gap-2 items-center justify-center align-middle">
                    <button onClick={() => {
                      navigate({
                        pathname: `/transfers/${transfer.id}/comments`,
                        search: createSearchParams({
                          id: `${transfer.id}`,
                          playersLogoUrl: `${transfer.playerLogoUrl}`,
                          playerFullName: `${transfer.playerFullName}`,
                          transferFeeInMillions: `${transfer.transferFeeInMillions}`,
                          fromTeamLogoUrl: `${transfer.fromTeamLogoUrl}`,
                          fromTeam: `${transfer.fromTeam}`,
                          toTeamLogoUrl: `${transfer.toTeamLogoUrl}`,
                          toTeam: `${transfer.toTeam}`,
                          numerOfLikes: `${transfer.numberOfLikes}`
                        }).toString()
                      });
                      localStorage.setItem("current-page", `/transfers/${transfer.id}/comments`)
                    }}>
                      <FaComment size={22} />
                    </button>
                    <p>Comment</p>
                  </div>
                  {localStorage.getItem("role") === "Admin" && <div className="flex gap-2 items-center justify-center align-middle">
                    <button onClick={() => {
                      navigate({
                        pathname: "/updating",
                        search: createSearchParams({
                          id: `${transfer.id}`,
                          playersLogoUrl: `${transfer.playerLogoUrl}`,
                          playerFullName: `${transfer.playerFullName}`,
                          transferFeeInMillions: `${transfer.transferFeeInMillions}`,
                          fromTeamLogoUrl: `${transfer.fromTeamLogoUrl}`,
                          fromTeam: `${transfer.fromTeam}`,
                          toTeamLogoUrl: `${transfer.toTeamLogoUrl}`,
                          toTeam: `${transfer.toTeam}`,
                          numerOfLikes: `${transfer.numberOfLikes}`
                        }).toString()
                      });
                      localStorage.setItem("current-page", "updating")
                    }}>
                      <FaRegEdit size={22} />
                    </button>
                    <p>Edit</p>
                  </div>}
                </div>
              </div>
            </div>
          ))}
        </div>}

        {
          //seaching transfer by player full name
        }
        {localStorage.getItem("searching_transfer") === "true" && localStorage.getItem("searching_transfer_by_player") === "true" && <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1">
          {screenTransfers.map(transfer => (
            <div className="p-4">
              <div className="bg-white border border-gray-300 rounded-lg shadow-xl dark:bg-gray-500 dark:border-gray-700"
                key={transfer.id}>
                <div className="text-end">
                  {localStorage.getItem("role") === "Admin" && <button className="pt-2 pe-2"
                    onClick={() =>
                      onDelete(transfer.id)
                    }>
                    <GoTrash size={22} />
                  </button>}
                </div>
                <div className="flex flex-col items-center pb-10">
                  <img className="w-24 h-24 mt-3 mb-3 rounded-full shadow-lg" src={transfer.playerLogoUrl} alt="" />
                  <div className="sm: text-center">
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-black">{transfer.playerFullName}</h5>
                    <h6 className="mb-1 text-sm font-medium text-gray-900 dark:text-black">
                      Trasfer Fee: {transfer.transferFeeInMillions === 0 || transfer.transferFeeInMillions === -1 ? (transfer.transferFeeInMillions === -1 ? "Loan" : "Free Transfer") : `${transfer.transferFeeInMillions}M€`}
                    </h6>
                    <span className="text-sm light:text-gray-500 dark:text-gray-400"></span>
                    <ul className="flex mt-10 space-x-7">
                      <li>
                        <ul>
                          <li><img className="w-32 h-32 mb-3 rounded-full shadow-lg" src={transfer.fromTeamLogoUrl} alt="" /></li>
                          <li className="w-32 h-32">{transfer.fromTeam}</li>
                        </ul>
                      </li>
                      <li className="mt-10">
                        <FaArrowRight size={22} />
                      </li>
                      <li>
                        <ul>
                          <li><img className="w-32 h-32 mb-3 rounded-full shadow-lg" src={transfer.toTeamLogoUrl} alt="" /></li>
                          <li className="w-32 h-32">{transfer.toTeam}</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex gap-2 items-start justify-start align-middle">
                    {transfer.numberOfLikes > 999 && transfer.numberOfLikes < 1000000 ? `${Math.round(transfer.numberOfLikes / 1000)}K`
                      : transfer.numberOfLikes > 999999 && transfer.numberOfLikes < 1000000 ? `${Math.round(transfer.numberOfLikes / 1000000)}M`
                        : transfer.numberOfLikes} People liked the transfer
                  </div>
                  <div className="flex gap-2 items-center justify-center align-middle">

                  </div>
                  <div className="flex gap-2 items-center justify-center align-middle">

                  </div>
                </div>
                <div className="border border-gray-400"></div>
                <div className="grid grid-cols-3 p-3">
                  <div className="flex gap-2 items-center justify-center align-middle">
                    <button
                      onClick={() => {
                        localStorage.setItem(`transfer${transfer.id}LikedBy${username}`, (((localStorage.getItem(`transfer${transfer.id}LikedBy${username}`) === null) || (localStorage.getItem(`transfer${transfer.id}LikedBy${username}`) === "false")) ? "true" : "false"));
                        onLiked(username,
                          transfer.id,
                          transfer.playerLogoUrl,
                          transfer.playerFullName,
                          transfer.transferFeeInMillions,
                          transfer.fromTeam,
                          transfer.fromTeamLogoUrl,
                          transfer.toTeam,
                          transfer.toTeamLogoUrl,
                          (transfer.numberOfLikes === undefined) ? 0 : transfer.numberOfLikes)
                      }}
                    >
                      {(localStorage.getItem(`transfer${transfer.id}LikedBy${username}`) === "true") ? <div className="text-red-600"><AiFillHeart size={22} /></div> : <div><AiOutlineHeart size={22} /></div>}
                    </button>
                    <p>Like</p>
                  </div>
                  <div className="flex gap-2 items-center justify-center align-middle">
                    <button onClick={() => {
                      navigate({
                        pathname: `/transfers/${transfer.id}/comments`,
                        search: createSearchParams({
                          id: `${transfer.id}`,
                          playersLogoUrl: `${transfer.playerLogoUrl}`,
                          playerFullName: `${transfer.playerFullName}`,
                          transferFeeInMillions: `${transfer.transferFeeInMillions}`,
                          fromTeamLogoUrl: `${transfer.fromTeamLogoUrl}`,
                          fromTeam: `${transfer.fromTeam}`,
                          toTeamLogoUrl: `${transfer.toTeamLogoUrl}`,
                          toTeam: `${transfer.toTeam}`,
                          numerOfLikes: `${transfer.numberOfLikes}`
                        }).toString()
                      });
                      localStorage.setItem("current-page", `/transfers/${transfer.id}/comments`)
                    }}>
                      <FaComment size={22} />
                    </button>
                    <p>Comment</p>
                  </div>
                  {localStorage.getItem("role") === "Admin" && <div className="flex gap-2 items-center justify-center align-middle">
                    <button onClick={() => {
                      navigate({
                        pathname: "/updating",
                        search: createSearchParams({
                          id: `${transfer.id}`,
                          playersLogoUrl: `${transfer.playerLogoUrl}`,
                          playerFullName: `${transfer.playerFullName}`,
                          transferFeeInMillions: `${transfer.transferFeeInMillions}`,
                          fromTeamLogoUrl: `${transfer.fromTeamLogoUrl}`,
                          fromTeam: `${transfer.fromTeam}`,
                          toTeamLogoUrl: `${transfer.toTeamLogoUrl}`,
                          toTeam: `${transfer.toTeam}`,
                          numerOfLikes: `${transfer.numberOfLikes}`
                        }).toString()
                      });
                      localStorage.setItem("current-page", "updating")
                    }}>
                      <FaRegEdit size={22} />
                    </button>
                    <p>Edit</p>
                  </div>}
                </div>
              </div>
            </div>
          ))}
        </div>}
        {
          //seaching transfer by team
        }
        {localStorage.getItem("searching_transfer") === "true" && localStorage.getItem("searching_transfer_by_team") === "true" && <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1">
          {screenTransfers.map(transfer => (
            <div className="p-4">
              <div className="bg-white border border-gray-300 rounded-lg shadow-xl dark:bg-gray-500 dark:border-gray-700"
                key={transfer.id}>
                <div className="text-end">
                  {localStorage.getItem("role") === "Admin" && <button className="pt-2 pe-2"
                    onClick={() =>
                      onDelete(transfer.id)
                    }>
                    <GoTrash size={22} />
                  </button>}
                </div>
                <div className="flex flex-col items-center pb-10">
                  <img className="w-24 h-24 mt-3 mb-3 rounded-full shadow-lg" src={transfer.playerLogoUrl} alt="" />
                  <div className="sm: text-center">
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-black">{transfer.playerFullName}</h5>
                    <h6 className="mb-1 text-sm font-medium text-gray-900 dark:text-black">
                      Trasfer Fee: {transfer.transferFeeInMillions === 0 || transfer.transferFeeInMillions === -1 ? (transfer.transferFeeInMillions === -1 ? "Loan" : "Free Transfer") : `${transfer.transferFeeInMillions}M€`}
                    </h6>
                    <span className="text-sm light:text-gray-500 dark:text-gray-400"></span>
                    <ul className="flex mt-10 space-x-7">
                      <li>
                        <ul>
                          <li><img className="w-32 h-32 mb-3 rounded-full shadow-lg" src={transfer.fromTeamLogoUrl} alt="" /></li>
                          <li className="w-32 h-32">{transfer.fromTeam}</li>
                        </ul>
                      </li>
                      <li className="mt-10">
                        <FaArrowRight size={22} />
                      </li>
                      <li>
                        <ul>
                          <li><img className="w-32 h-32 mb-3 rounded-full shadow-lg" src={transfer.toTeamLogoUrl} alt="" /></li>
                          <li className="w-32 h-32">{transfer.toTeam}</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex gap-2 items-start justify-start align-middle">
                    {transfer.numberOfLikes > 999 && transfer.numberOfLikes < 1000000 ? `${Math.round(transfer.numberOfLikes / 1000)}K`
                      : transfer.numberOfLikes > 999999 && transfer.numberOfLikes < 1000000 ? `${Math.round(transfer.numberOfLikes / 1000000)}M`
                        : transfer.numberOfLikes} People liked the transfer
                  </div>
                  <div className="flex gap-2 items-center justify-center align-middle">

                  </div>
                  <div className="flex gap-2 items-center justify-center align-middle">

                  </div>
                </div>
                <div className="border border-gray-400"></div>
                <div className="grid grid-cols-3 p-3">
                  <div className="flex gap-2 items-center justify-center align-middle">
                    <button
                      onClick={() => {
                        localStorage.setItem(`transfer${transfer.id}LikedBy${username}`, (((localStorage.getItem(`transfer${transfer.id}LikedBy${username}`) === null) || (localStorage.getItem(`transfer${transfer.id}LikedBy${username}`) === "false")) ? "true" : "false"));
                        onLiked(username,
                          transfer.id,
                          transfer.playerLogoUrl,
                          transfer.playerFullName,
                          transfer.transferFeeInMillions,
                          transfer.fromTeam,
                          transfer.fromTeamLogoUrl,
                          transfer.toTeam,
                          transfer.toTeamLogoUrl,
                          (transfer.numberOfLikes === undefined) ? 0 : transfer.numberOfLikes)
                        navigate("/transfers");
                      }}
                    >
                      {(localStorage.getItem(`transfer${transfer.id}LikedBy${username}`) === "true") ? <div className="text-red-600"><AiFillHeart size={22} /></div> : <div><AiOutlineHeart size={22} /></div>}
                    </button>
                    <p>Like</p>
                  </div>
                  <div className="flex gap-2 items-center justify-center align-middle">
                    <button onClick={() => {
                      navigate({
                        pathname: `/transfers/${transfer.id}/comments`,
                        search: createSearchParams({
                          id: `${transfer.id}`,
                          playersLogoUrl: `${transfer.playerLogoUrl}`,
                          playerFullName: `${transfer.playerFullName}`,
                          transferFeeInMillions: `${transfer.transferFeeInMillions}`,
                          fromTeamLogoUrl: `${transfer.fromTeamLogoUrl}`,
                          fromTeam: `${transfer.fromTeam}`,
                          toTeamLogoUrl: `${transfer.toTeamLogoUrl}`,
                          toTeam: `${transfer.toTeam}`,
                          numerOfLikes: `${transfer.numberOfLikes}`
                        }).toString()
                      });
                      localStorage.setItem("current-page", `/transfers/${transfer.id}/comments`)
                    }}>
                      <FaComment size={22} />
                    </button>
                    <p>Comment</p>
                  </div>
                  {localStorage.getItem("role") === "Admin" && <div className="flex gap-2 items-center justify-center align-middle">
                    <button onClick={() => {
                      navigate({
                        pathname: "/updating",
                        search: createSearchParams({
                          id: `${transfer.id}`,
                          playersLogoUrl: `${transfer.playerLogoUrl}`,
                          playerFullName: `${transfer.playerFullName}`,
                          transferFeeInMillions: `${transfer.transferFeeInMillions}`,
                          fromTeamLogoUrl: `${transfer.fromTeamLogoUrl}`,
                          fromTeam: `${transfer.fromTeam}`,
                          toTeamLogoUrl: `${transfer.toTeamLogoUrl}`,
                          toTeam: `${transfer.toTeam}`,
                          numerOfLikes: `${transfer.numberOfLikes}`
                        }).toString()
                      });
                      localStorage.setItem("current-page", "updating")
                    }}>
                      <FaRegEdit size={22} />
                    </button>
                    <p>Edit</p>
                  </div>}
                </div>
              </div>
            </div>
          ))}
        </div>}
        {
          //seaching transfer by transfer fee range
        }
        {localStorage.getItem("searching_transfer") === "true" && localStorage.getItem("searching_transfer_by_range") === "true" && <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1">
          {screenTransfers.map(transfer => (
            <div className="p-4">
              <div className="bg-white border border-gray-300 rounded-lg shadow-xl dark:bg-gray-500 dark:border-gray-700"
                key={transfer.id}>
                <div className="text-end">
                  {localStorage.getItem("role") === "Admin" && <button className="pt-2 pe-2"
                    onClick={() =>
                      onDelete(transfer.id)
                    }>
                    <GoTrash size={22} />
                  </button>}
                </div>
                <div className="flex flex-col items-center pb-10">
                  <img className="w-24 h-24 mt-3 mb-3 rounded-full shadow-lg" src={transfer.playerLogoUrl} alt="" />
                  <div className="sm: text-center">
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-black">{transfer.playerFullName}</h5>
                    <h6 className="mb-1 text-sm font-medium text-gray-900 dark:text-black">
                      Trasfer Fee: {transfer.transferFeeInMillions === 0 || transfer.transferFeeInMillions === -1 ? (transfer.transferFeeInMillions === -1 ? "Loan" : "Free Transfer") : `${transfer.transferFeeInMillions}M€`}
                    </h6>
                    <span className="text-sm light:text-gray-500 dark:text-gray-400"></span>
                    <ul className="flex mt-10 space-x-7">
                      <li>
                        <ul>
                          <li><img className="w-32 h-32 mb-3 rounded-full shadow-lg" src={transfer.fromTeamLogoUrl} alt="" /></li>
                          <li className="w-32 h-32">{transfer.fromTeam}</li>
                        </ul>
                      </li>
                      <li className="mt-10">
                        <FaArrowRight size={22} />
                      </li>
                      <li>
                        <ul>
                          <li><img className="w-32 h-32 mb-3 rounded-full shadow-lg" src={transfer.toTeamLogoUrl} alt="" /></li>
                          <li className="w-32 h-32">{transfer.toTeam}</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex gap-2 items-start justify-start align-middle">
                    {transfer.numberOfLikes > 999 && transfer.numberOfLikes < 1000000 ? `${Math.round(transfer.numberOfLikes / 1000)}K`
                      : transfer.numberOfLikes > 999999 && transfer.numberOfLikes < 1000000 ? `${Math.round(transfer.numberOfLikes / 1000000)}M`
                        : transfer.numberOfLikes} People liked the transfer
                  </div>
                  <div className="flex gap-2 items-center justify-center align-middle">

                  </div>
                  <div className="flex gap-2 items-center justify-center align-middle">

                  </div>
                </div>
                <div className="border border-gray-400"></div>
                <div className="grid grid-cols-3 p-3">
                  <div className="flex gap-2 items-center justify-center align-middle">
                    <button
                      onClick={() => {
                        localStorage.setItem(`transfer${transfer.id}LikedBy${username}`, (((localStorage.getItem(`transfer${transfer.id}LikedBy${username}`) === null) || (localStorage.getItem(`transfer${transfer.id}LikedBy${username}`) === "false")) ? "true" : "false"));
                        onLiked(username,
                          transfer.id,
                          transfer.playerLogoUrl,
                          transfer.playerFullName,
                          transfer.transferFeeInMillions,
                          transfer.fromTeam,
                          transfer.fromTeamLogoUrl,
                          transfer.toTeam,
                          transfer.toTeamLogoUrl,
                          (transfer.numberOfLikes === undefined) ? 0 : transfer.numberOfLikes)
                      }}
                    >
                      {(localStorage.getItem(`transfer${transfer.id}LikedBy${username}`) === "true") ? <div className="text-red-600"><AiFillHeart size={22} /></div> : <div><AiOutlineHeart size={22} /></div>}
                    </button>
                    <p>Like</p>
                  </div>
                  <div className="flex gap-2 items-center justify-center align-middle">
                    <button onClick={() => {
                      navigate({
                        pathname: `/transfers/${transfer.id}/comments`,
                        search: createSearchParams({
                          id: `${transfer.id}`,
                          playersLogoUrl: `${transfer.playerLogoUrl}`,
                          playerFullName: `${transfer.playerFullName}`,
                          transferFeeInMillions: `${transfer.transferFeeInMillions}`,
                          fromTeamLogoUrl: `${transfer.fromTeamLogoUrl}`,
                          fromTeam: `${transfer.fromTeam}`,
                          toTeamLogoUrl: `${transfer.toTeamLogoUrl}`,
                          toTeam: `${transfer.toTeam}`,
                          numerOfLikes: `${transfer.numberOfLikes}`
                        }).toString()
                      });
                      localStorage.setItem("current-page", `/transfers/${transfer.id}/comments`)
                    }}>
                      <FaComment size={22} />
                    </button>
                    <p>Comment</p>
                  </div>
                  {localStorage.getItem("role") === "Admin" && <div className="flex gap-2 items-center justify-center align-middle">
                    <button onClick={() => {
                      navigate({
                        pathname: "/updating",
                        search: createSearchParams({
                          id: `${transfer.id}`,
                          playersLogoUrl: `${transfer.playerLogoUrl}`,
                          playerFullName: `${transfer.playerFullName}`,
                          transferFeeInMillions: `${transfer.transferFeeInMillions}`,
                          fromTeamLogoUrl: `${transfer.fromTeamLogoUrl}`,
                          fromTeam: `${transfer.fromTeam}`,
                          toTeamLogoUrl: `${transfer.toTeamLogoUrl}`,
                          toTeam: `${transfer.toTeam}`,
                          numerOfLikes: `${transfer.numberOfLikes}`
                        }).toString()
                      });
                      localStorage.setItem("current-page", "updating")
                    }}>
                      <FaRegEdit size={22} />
                    </button>
                    <p>Edit</p>
                  </div>}
                </div>
              </div>
            </div>
          ))}
        </div>}

      </div>
      <div className="flex gap-2 items-center justify-center pb-5">
        {(localStorage.getItem("searching_transfer") === "false") && pageNo > 0 && <button className="bg-gray-500 border border-gray-700 rounded-lg shadow dark:bg-gray-500 dark:border-gray-700 h-10 w-40" onClick={() => {
          setPageNo(pageNo + 1);
          localStorage.setItem("transfer_page_number", `${Number(localStorage.getItem("transfer_page_number")) - 1}`);
          navigate("/transfers");
          localStorage.setItem("current-page", "transfers")
          window.location.reload();
        }}>
          Previous Page
        </button>}
        {(localStorage.getItem("searching_transfer") === "false") && ((Number(res?.data.totalPages) - 1 > Number(localStorage.getItem("transfer_page_number")))) && <button className="bg-gray-500 border border-gray-700 rounded-lg shadow dark:bg-gray-500 dark:border-gray-700 h-10 w-40" onClick={() => {
          setPageNo(pageNo + 1);
          localStorage.setItem("transfer_page_number", `${Number(localStorage.getItem("transfer_page_number")) + 1}`);
          navigate("/transfers");
          localStorage.setItem("current-page", "transfers")
          window.location.reload();
        }}>
          Next Page
        </button>}
      </div>
    </div>
  )
}

export default Transfers