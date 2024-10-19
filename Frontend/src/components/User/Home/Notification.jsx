import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getGlobalVariable } from "../../../globalVariables";
const Backend = getGlobalVariable();

function Notification() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    async function getData() {
      let token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          let TOKENUSERNAME =
            decodedToken.username || decodedToken.sub || decodedToken.email;

          const response = await axios.get(
            `${Backend}/API/${TOKENUSERNAME}/notification`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const recent_activity = response.data;
          setNotification(recent_activity);
        } catch (error) {
          alert(error);
        }
      }
    }
    getData();
  }, []);

  const handelAccept = async (trip_id) => {
    try {
      await axios.get(
        `${Backend}/API/${username}/notification/accept/${trip_id}`
      );
      navigate(0);
    } catch (error) {
      alert(error);
    }
  };

  const handelReject = async (trip_id) => {
    try {
      await axios.get(
        `${Backend}/API/${username}/notification/reject/${trip_id}`
      );
      navigate(0);
    } catch (error) {
      alert(error);
    }
  };

  const handelRemove = async (trip_id) => {
    try {
      await axios.get(
        `${Backend}/API/${username}/notification/remove/${trip_id}`
      );
      navigate(0);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {notification && notification.length > 0 ? (
        <div className="space-y-4">
          {notification.map((noti, idx) => (
            <div
              key={idx}
              className="flex flex-col p-4 sm:p-6 bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg mb-4 space-y-3"
            >
              <div className="flex items-start sm:items-center justify-between">
                <div className="flex items-start sm:items-center space-x-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl p-2 border border-blue-100 text-blue-400 bg-blue-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="flex flex-col">
                    <div className="font-semibold text-lg text-gray-800">
                      {noti.name}{" "}
                      <Link
                        to={`/${noti.by}/trip/${noti.trip_id}`}
                        className="text-blue-500 hover:underline transition-colors duration-300"
                      >
                        &rarr;
                      </Link>
                    </div>
                    <p className="text-gray-600 mt-1">{noti.details}</p>
                    <p className="text-sm text-gray-500 opacity-70">
                      {new Date(noti.date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!noti.request ? (
                    <>
                      <button
                        onClick={() => handelAccept(noti.trip_id)}
                        className="bg-blue-500 px-3 py-1.5 text-sm font-medium text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handelReject(noti.trip_id)}
                        className="bg-red-500 px-3 py-1.5 text-sm font-medium text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors duration-300"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handelRemove(noti.trip_id)}
                      className="bg-red-500 px-3 py-1.5 text-sm font-medium text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors duration-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 bg-white shadow-md hover:shadow-lg rounded-lg text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-14 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-600 font-medium text-lg">
            No notifications found
          </p>
          <p className="text-gray-500 text-sm mt-2">
            You currently have no new notifications. Check back later!
          </p>
        </div>
      )}
    </div>
  );
}

export default Notification;
