import { useState, useEffect } from "react";
import UserHeader from "../UserHeader";
import HomeTripCard from "./HomeTripCard";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import WentWrong from "../../Alert/WentWrong";
import { getGlobalVariable } from "../../../globalVariables";
const Backend = getGlobalVariable();

function UserHome() {
  const [recentActivity, setRecentActivity] = useState([]);
  const [userData, setUserData] = useState(null);
  const [TOKEN_USERNAME, setTOKEN_USERNAME] = useState("");

  useEffect(() => {
    async function getData() {
      let token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          let TOKENUSERNAME =
            decodedToken.username || decodedToken.sub || decodedToken.email;

          setTOKEN_USERNAME(TOKENUSERNAME);

          const response = await axios.get(`${Backend}/API/${TOKENUSERNAME}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const user_data = response.data;
          setUserData(user_data);

          setRecentActivity(user_data["recent_activity"]);
        } catch (error) {
          return <WentWrong />;
        }
      }
    }
    getData();
  }, []);

  return (
    <>
      {userData ? (
        <>
          <UserHeader user_Profile={userData["profile_picture"]} />
          <div className="user-home text-center flex flex-col md:flex-row">
            {/* Part A (Sidebar) - Hidden on small screens */}
            <div className="part-A w-full md:w-1/5 h-screen hidden md:block p-4">
              <img
                src="https://assets.cntraveller.in/photos/61f008784d495b4b023dc47c/master/w_1600%2Cc_limit/GettyImages-615512736.jpg" // Replace with an actual image link
                alt="India Tourism"
                className="w-full h-auto rounded-md shadow-lg"
              />
              <h2 className="text-lg font-bold mt-4">Explore India</h2>
              <p className="text-sm mt-2 text-gray-700">
                Discover the beauty of India, from the snow-capped mountains of
                the Himalayas to the sun-kissed beaches of Goa. Enjoy the rich
                history, vibrant cultures, and breathtaking landscapes.
              </p>
            </div>

            {/* Main Content */}
            <div className="part-Main p-4 border border-gray-200 w-full md:w-4/5 align-center">
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.reverse().map((activity) => (
                  <Link
                    to={`/${activity.username}/trip/${activity["_id"]}`}
                    key={activity["_id"]}
                  >
                    <HomeTripCard trip={activity} />
                  </Link>
                ))
              ) : (
                <p>No recent activity available.</p>
              )}
            </div>

            {/* Part B (Sidebar) - Hidden on small screens */}
            <div className="part-B w-full md:w-1/5 h-screen hidden md:block p-4">
              <img
                src="https://i.pinimg.com/736x/e1/63/02/e16302cad9ff3f9e3a6b16e608f47a8e.jpg" // Replace with an actual image link
                alt="Tourist Destinations"
                className="w-full h-auto rounded-md shadow-lg"
              />
              <h2 className="text-lg font-bold mt-4">Top Destinations</h2>
              <ul className="text-sm mt-2 text-gray-700 ">
                <li>- Varanasi, Uttar Pradesh</li>
                <li>- Ram mandir, Ayodhya</li>
                <li>- Jaipur, Rajasthan</li>
                <li>- Kerala Backwaters</li>
                <li>- Andaman & Nicobar Islands</li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default UserHome;
