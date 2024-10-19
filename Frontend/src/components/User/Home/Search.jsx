import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getGlobalVariable } from "../../../globalVariables";
const Backend = getGlobalVariable();

function Search() {
  const [allUser, setAllUser] = useState([]);
  const { username } = useParams();
  const [wordEntered, setWordEntered] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    async function getData() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            `${Backend}/API/${username}/search/alluser`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const user_data = response.data; // Extract data from the response
          setAllUser(user_data); // Log or process the data
        } catch (error) {
          alert(error);
        }
      }
    }
    getData();
  }, [username]);

  const searchChangeHandler = (e) => {
    const searchWord = e.target.value;
    setWordEntered(searchWord);
    const filter_data = allUser.filter((value) => {
      return value.username.toLowerCase().includes(searchWord.toLowerCase());
    });
    setFilteredData(searchWord === "" ? [] : filter_data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-3/4 lg:w-1/2">
        <label
          htmlFor="username"
          className="block text-lg font-semibold text-gray-900 mb-4"
        >
          Search for Users
        </label>
        <input
          onChange={searchChangeHandler}
          value={wordEntered}
          id="username"
          name="username"
          type="text"
          placeholder="Search..."
          className="block w-full rounded-md border border-gray-300 py-2 px-4 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm mb-4"
        />
        <div className="overflow-y-auto max-h-96">
          <ul className="space-y-2">
            {filteredData.length > 0 ? (
              filteredData.map((user, idx) => (
                <a
                  href={`/${user.username}`}
                  key={idx}
                  className="flex items-center space-x-4 p-2 rounded hover:bg-gray-100 cursor-pointer"
                >
                  <li
                    key={idx}
                    className="flex items-center space-x-4 p-2 rounded hover:bg-gray-100 cursor-pointer"
                  >
                    <img
                      src={user.profile_picture}
                      alt={`${user.username}'s profile`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-gray-900 hover:underline">
                        {user.username}
                      </p>
                      <span className="text-sm text-gray-500">{user.name}</span>
                    </div>
                  </li>
                </a>
              ))
            ) : (
              <p className="text-gray-500 text-center">No users found</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Search;
