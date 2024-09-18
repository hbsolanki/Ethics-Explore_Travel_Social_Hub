// eslint-disable-next-line react/prop-types
function ProfileTrip({ trip }) {
  return (
    <div className="w-full p-6 border mb-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col items-start">
        {/* Trip Username */}
        <span className="font-medium mb-1">
          Username: <span className="text-blue-600">@{trip.username}</span>
        </span>

        {/* Trip Name */}
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          Trip-name: {trip.Trip_Name}
        </h3>

        {/* Source */}
        <div className="text-gray-700 mb-4">
          <span className="font-medium text-gray-800">Source:</span>{" "}
          {trip.source}
        </div>

        {/* Destinations */}
        <div className="text-gray-700 mb-4">
          <div className="mt-2 flex flex-wrap items-center">
            <span className="font-medium mr-2 text-gray-800">
              Destinations:
            </span>
            {trip.destination.map((name, idx) => (
              <span className="text-sm text-gray-600 mx-1" key={idx}>
                {name}
                {idx < trip.destination.length - 1 && (
                  <span className="mx-1 text-gray-400">→</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="text-gray-700 mb-4">
          <span className="font-medium text-gray-800">Description:</span>{" "}
          <span className="text-gray-600 font-light text-sm">
            {trip.discription}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProfileTrip;
