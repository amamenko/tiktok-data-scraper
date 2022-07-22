import { Duration, format } from "date-fns";
import { LiveRoom } from "../../interfaces/LiveRoom.interface";
import { IoDiamond } from "react-icons/io5";
import "./RoomCard.scss";

export const RoomCard = ({
  live,
  totalDuration,
  index,
}: {
  live: LiveRoom;
  totalDuration: Duration;
  index: number;
}) => {
  const hours = totalDuration.hours;
  const minutes = totalDuration.minutes;
  const seconds = totalDuration.seconds;
  return (
    <div className="room_outer_container">
      <div className="room_user_container">
        <span className="number_circle">
          <p>{index + 1}</p>
        </span>
        <p>{live.displayID}</p>
        <img src={live.avatar} alt={`${live.displayID} avatar`} />
      </div>
      <div className="diamonds_container">
        <IoDiamond size={20} color={"rgb(150, 150, 150)"} />
        <p className="diamonds_count">{live.diamonds}</p>
      </div>
      <div className="room_time_container">
        <div className="time_label">
          <h2>STARTED:</h2>
        </div>
        <p>{format(new Date(live.createdAt), "Pp")}</p>
        <div className="time_label">
          <h2>UPDATED:</h2>
        </div>
        <p>{format(new Date(live.updatedAt), "Pp")}</p>
        <div className="time_label">
          <h2>DURATION:</h2>
        </div>
        <p>
          {hours ? `${hours > 9 ? hours : "0" + hours}:` : "00:"}
          {minutes ? `${minutes > 9 ? minutes : "0" + minutes}:` : "00:"}
          {seconds ? `${seconds > 9 ? seconds : "0" + seconds}` : "00"}
        </p>
      </div>
    </div>
  );
};
