import { FETCH_RESTAURANTS_LIST } from "./contants";
import { CardContainer } from "./CardContainer";
import { useState, useEffect } from "react";
import Shimmer from "./Shimmer";
import useOnline from "../utils/useOnline";
import { Link } from "react-router-dom";
function filterData(searchTxt, restaurants) {
  return restaurants.filter((restaurant) =>
    restaurant?.data?.name?.toLowerCase().includes(searchTxt)
  );
}
//ok

const Body = () => {
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [searchTxt, setsearchTxt] = useState("");
  const [restaurants, setRestaurants] = useState(null);

  async function getRestaurants() {
    const data = await fetch(FETCH_RESTAURANTS_LIST, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        contentType: "application/json",
      },
    });
    const json = await data.json();
    setRestaurants(
      json?.data?.cards[1].card?.card?.gridElements?.infoWithStyle?.restaurants
    );
  }
  useEffect(() => {
    if (restaurants == null) {
      getRestaurants();
    }
  }, [restaurants]);

  // conditional rendering
  // code shimmer UI

  const isOnline = useOnline();
  {
    console.log(restaurants);
  }
  if (!isOnline) {
    return (
      <div>
        <div className="Offline">c</div>
        <h1>Offline, please check your Internet!!</h1>
      </div>
    );
  }

  return restaurants?.length === 0 ? (
    <Shimmer />
  ) : (
    <div className="body">
      <div className="search-container p-5 bg-orange-50 my-3">
        <input
          type="text"
          className=" focus:bg-green-50 p-2 m-2"
          placeholder="Search"
          value={searchTxt}
          onChange={(e) => {
            setsearchTxt(e.target.value);
          }}
        />
        <button
          data-testid="search-btn"
          className="p-2 m-3 bg-purple-500 hover:bg-gray-600 text-white rounded-md"
          onClick={() => {
            const data = filterData(searchTxt, restaurants);
            setRestaurants(data);
          }}
        >
          Search
        </button>
      </div>
      <div
        className="flex flex-wrap md:container md:mx-auto"
        data-testid="res-list"
      >
        {restaurants?.length > 0
          ? restaurants.map((restaurant, index) => (
              <CardContainer {...restaurant.info} key={restaurant?.info?.id} />
            ))
          : null}
      </div>
    </div>
  );
};

export default Body;
