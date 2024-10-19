import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getGlobalVariable } from "../../../globalVariables";
const Backend = getGlobalVariable();

function Follower() {
  const { username } = useParams();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    async function getData() {
      const user_data = (await axios.get(`${Backend}/API/${username}`)).data;

      setUserData(user_data);
    }
    getData();
  }, [username]);

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
      {/* {userData["followers"]
        ? userData["followers"].map((follower, idx) => (
            <p key={idx}>{follower}</p>
          ))
        : ""} */}
      <h2 className="text-xl font-semibold mb-4">Followers</h2>
      {userData["followers"] ? (
        <ul className="space-y-4">
          {userData["followers"].map((follower, idx) => (
            <a
              href={`/${follower.username}`}
              key={idx}
              className="flex items-center space-x-4 border-b pb-2 last:border-none"
            >
              <li
                key={idx}
                className="flex items-center space-x-4 border-b pb-2 last:border-none"
              >
                <img
                  src={follower.pic}
                  alt={`${follower.username}'s profile`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{follower.username}</p>
                  <p className="text-sm text-gray-500">{follower.name}</p>
                </div>
              </li>
            </a>
          ))}
        </ul>
      ) : (
        <p>No followers found.</p>
      )}
    </div>
  );
}

export default Follower;
