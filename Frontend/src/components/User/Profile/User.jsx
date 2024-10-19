import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import ProfileTrip from "./ProfileTrip";
import UserProfile from "./UserProfile";
import WentWrong from "../../Alert/WentWrong";
import { jwtDecode } from "jwt-decode";
import Breadcrumbs from "./Breadcrumbs";
import Logout from "./Logout";
import { getGlobalVariable } from "../../globalVariables";
const Backend = getGlobalVariable();

function User() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [wordEntered, setWordEntered] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [userIsValid, setUserIsValid] = useState(false);
  const [TOKEN_USERNAME, setTOKEN_USERNAME] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`${Backend}/API/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user_data = response.data;
        setUserData(user_data);

        if (token) {
          const decodedToken = jwtDecode(token);
          const TOKEN_USERNAME =
            decodedToken.username || decodedToken.sub || decodedToken.email;
          setTOKEN_USERNAME(TOKEN_USERNAME);
          setUserIsValid(TOKEN_USERNAME === username);
          if (
            user_data.followers.some(
              (follower) => follower.follower_username === TOKEN_USERNAME
            )
          ) {
            setIsFollowing(true);
          }
        }
      } catch (error) {
        setError(true);
        // navigate("/pagenotfound");
      }
    }
    getData();
  }, [username, navigate, token]);

  const searchChangeHandler = (e) => {
    const searchWord = e.target.value;
    setWordEntered(searchWord);
    if (userData) {
      const filteredTrips = userData.trips.filter((trip) =>
        trip.Trip_Name.toLowerCase().includes(searchWord.toLowerCase())
      );
      setFilteredData(searchWord ? filteredTrips : userData.trips);
    }
  };

  const handleFollow = async () => {
    try {
      await axios.get(
        `${Backend}/API/${TOKEN_USERNAME}/following/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsFollowing(true); // Update follow status
      navigate(0);
    } catch (error) {
      setError(true);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.get(`${Backend}/API/${TOKEN_USERNAME}/unfollow/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsFollowing(false); // Update follow status
      navigate(0);
    } catch (error) {
      setError(true);
    }
  };

  const checkingFollowed = () => {
    if (TOKEN_USERNAME) {
      const followerListForUsername = userData["followers"];

      const isFollowing = followerListForUsername.some(
        (val) => val.username === TOKEN_USERNAME
      );

      return isFollowing ? (
        <button
          onClick={handleUnfollow}
          className="py-2 px-4 rounded text-white font-semibold bg-red-600 hover:bg-red-700"
        >
          Unfollow
        </button>
      ) : (
        <button
          onClick={handleFollow}
          className="py-2 px-4 rounded text-white font-semibold bg-blue-600 hover:bg-blue-700"
        >
          Follow
        </button>
      );
    }
    return null;
  };

  if (error) return <WentWrong />;

  return (
    <div className="border border-gray-300 rounded-lg shadow-lg p-6 max-w-4xl mx-auto mt-8">
      {userData ? (
        <>
          {TOKEN_USERNAME && <Breadcrumbs username={TOKEN_USERNAME} />}
          <UserProfile userData={userData} />
          <div className="flex justify-center items-center mt-6">
            {userIsValid ? (
              <div className="flex space-x-4">
                <Link
                  className="focus:outline-none text-white bg-cyan-100 hover:bg-cyan-800 focus:ring-4 focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-900"
                  to={`/${userData.username}/profilesetting`}
                >
                  Settings
                </Link>
                <Logout />
              </div>
            ) : (
              checkingFollowed()
            )}
          </div>
          <div className="mt-4 text-center">
            <input
              onChange={searchChangeHandler}
              value={wordEntered}
              placeholder="Search trips..."
              className="border border-gray-300 rounded py-2 px-4 w-3/4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button className="ml-2 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 m-">
              Search Trip
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 mt-6">
            {(filteredData.length ? filteredData : userData.trips)
              .reverse()
              .map((trip) => (
                <Link to={`/${username}/trip/${trip._id}`} key={trip._id}>
                  <ProfileTrip trip={trip} />
                </Link>
              ))}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">Loading...</p>
      )}
    </div>
  );
}

export default User;
