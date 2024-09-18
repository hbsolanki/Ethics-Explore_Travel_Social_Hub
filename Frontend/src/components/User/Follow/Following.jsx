import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Following() {
  const { username } = useParams();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    async function getData() {
      const user_data = (await axios.get(`/API/${username}`)).data;
      // console.log(user_data);
      setUserData(user_data);
    }
    [];
    getData();
  }, []);
  return (
    <>
      <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
        {/* {userData["followings"]
        ? userData["followings"].map((following, idx) => (
            <p key={idx}>{following}</p>
          ))
        : ""} */}
        <h2 className="text-xl font-semibold mb-4">Followings</h2>
        {userData["followings"] ? (
          <ul className="space-y-4">
            {userData["followings"].map((following, idx) => (
              <a
                href={`/${following.username}`}
                key={idx}
                className="flex items-center space-x-4 border-b pb-2 last:border-none"
              >
                <li className="flex items-center space-x-4 border-b pb-2 last:border-none">
                  <img
                    src={following.pic}
                    alt={`${following.following_username}'s profile`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{following.username}</p>
                    <p className="text-sm text-gray-500">{following.name}</p>
                  </div>
                </li>
              </a>
            ))}
          </ul>
        ) : (
          <p>No Followings found.</p>
        )}
      </div>
    </>
  );
}

export default Following;
