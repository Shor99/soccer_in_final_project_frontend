import { useContext } from "react";
import { useParams } from "react-router-dom"
import SoccerinContext from "../context/SoccerinContext";


const TransfersDetails = () => {
  const {id} = useParams();
  const {transfers} = useContext(SoccerinContext);

  const transfer = transfers.find((t) => t.id.toString() === id);

  if(transfer)
    return <div>{transfer.playerFullName}</div>

  return <div> No Such Transfers</div>;
};

export default TransfersDetails