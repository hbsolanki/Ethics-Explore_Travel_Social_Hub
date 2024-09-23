import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Trip = () => {
  const { username, tripid } = useParams();
  const [tripData, setTripData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      const tripData = (await axios.get(`/API/${username}/trip/${tripid}`))
        .data;
      setTripData(tripData);
    }
    getData();
  }, [username, tripid]);

  const [TOKEN_USERNAME, setTOKEN_USERNAME] = useState("");

  useEffect(() => {
    async function getData() {
      let token = localStorage.getItem("token");

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const TOKENUSERNAME =
            decodedToken.username || decodedToken.sub || decodedToken.email;
          setTOKEN_USERNAME(TOKENUSERNAME);
        } catch (error) {
          alert(error);
        }
      }
    }
    getData();
  }, [username, navigate]);

  return (
    <>
      {tripData ? (
        <section className="pb-10 pt-10 lg:pt-20 lg:pb-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto mb-16 text-center relative">
              <Link className="font-medium" to={`/${tripData.username}`}>
                @{tripData.username}
              </Link>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                {tripData.Trip_Name}
              </h2>
              <div className="flex justify-center space-x-6 text-gray-600 mb-6">
                <span>{tripData.status}</span>
                <span>{tripData.date}</span>
              </div>
              <div className="text-lg font-medium text-gray-700 mb-4">
                <p>Source: {tripData.source}</p>
                {tripData.destination && (
                  <p>
                    Destinations:{" "}
                    {tripData.destination.map((name, idx) => (
                      <span key={idx} className="inline-block mr-2 opacity-75">
                        {name}
                      </span>
                    ))}
                  </p>
                )}
              </div>
              <p className="text-gray-600 mb-4">{tripData.discription}</p>
              {tripData.friends ? (
                <p className="text-gray-600 mb-4">
                  Friends: {tripData.friends}
                </p>
              ) : (
                ""
              )}

              <div className="absolute bottom-0 right-0"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {tripData.photos
                ? tripData.photos.map((link, idx) => (
                    <PhotoCard key={idx} imageSrc={link} />
                  ))
                : null}
            </div>
          </div>
        </section>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

const PhotoCard = ({ imageSrc }) => {
  return (
    <div className="w-full h-auto overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <img
        src={imageSrc}
        alt="Trip photo"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Trip;
