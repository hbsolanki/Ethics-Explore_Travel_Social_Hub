import { useState } from "react";
import { useParams } from "react-router-dom";
import Logo from "../../assets/Ethics_Logo.png";

export default function NewTrip() {
  const { username } = useParams();
  const [visitedPlace, setVisitedPlace] = useState(1);

  const clickHandlerPlace = () => {
    setVisitedPlace(visitedPlace + 1);
    let placeDiv = document.getElementById("place");
    let newInput = document.createElement("input");
    newInput.id = `destination${visitedPlace}`;
    newInput.name = `destination${visitedPlace}`;
    newInput.required = true;
    newInput.className =
      "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6";
    placeDiv.appendChild(newInput);
  };

  const handleClick = () => {
    if (visitedPlace > 1) {
      let placeDiv = document.getElementById("place");
      let lastInput = document.getElementById(`destination${visitedPlace - 1}`);
      if (lastInput) {
        placeDiv.removeChild(lastInput);
        setVisitedPlace(visitedPlace - 1);
      }
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-24 w-auto" src={Logo} alt="Your Company" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            New Trip
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            encType="multipart/form-data"
            action={`http://127.0.0.1:8000/API/${username}/newtrip`}
            method="post"
          >
            <div>
              <label
                htmlFor="Trip_Name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Trip Name
              </label>
              <div className="mt-2">
                <input
                  id="Trip_Name"
                  name="Trip_Name"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Date
              </label>
              <div className="mt-2">
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="mt-2">
              <label
                htmlFor="status"
                className="text-sm font-medium leading-6 text-gray-900 mr-4"
              >
                Status:
              </label>
              <input
                id="status"
                name="status"
                type="radio"
                value="future"
                required
                className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              />
              Future
              <input
                id="status"
                name="status"
                type="radio"
                value="current"
                required
                className="ml-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              />
              Current
              <input
                id="status"
                name="status"
                type="radio"
                value="past"
                required
                className="ml-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              />
              Past
            </div>

            <div>
              <label
                htmlFor="source"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Source
              </label>
              <div className="mt-2">
                <input
                  id="source"
                  name="source"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="destination1"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Visit Place
                </label>
              </div>
              <div className="mt-2" id="place">
                <input
                  id="destination"
                  name="destination"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="">
                <div className="flex space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={clickHandlerPlace}
                    className="flex-1 w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                  >
                    Add Place
                  </button>
                  <button
                    type="button"
                    onClick={handleClick}
                    className="flex-1 w-1/2 justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                  >
                    Delete Place
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="discription"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="discription"
                  name="discription"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="friends"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Friends
              </label>
              <div className="mt-2">
                <input
                  id="friends"
                  name="friends"
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="photos"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-greey-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-600 focus-within:ring-offset-2 hover:text-gray-500"
              >
                <span>Upload Photos</span>
                <input
                  id="photos"
                  name="photos"
                  type="file"
                  className="sr-only"
                  multiple
                />
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-gray-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
