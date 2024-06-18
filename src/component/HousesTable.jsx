import React, { useEffect, useState } from "react";

const fetchHouseData = async () => {
  const response = await fetch("https://anapioficeandfire.com/api/houses");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchSwornMembers = async (swornMembers) => {
  const memberNames = [];
  for (const url of swornMembers) {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      memberNames.push(data.name);
    }
  }
  return memberNames.length ? memberNames.join(", ") : "None";
};

const processHouseData = async (house) => {
  const titles = house.titles.length ? house.titles.join(", ") : "None";
  const swornMembers = await fetchSwornMembers(house.swornMembers);
  return {
    name: house.name,
    region: house.region,
    titles: titles,
    swornMembers: swornMembers,
  };
};

const HousesTable = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const houseData = await fetchHouseData();
      const processedData = await Promise.all(houseData.map(processHouseData));
      setHouses(processedData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {loading && <p>Loading</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <table border={1}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Region</th>
              <th>Titles</th>
              <th>Sworn Members</th>
            </tr>
          </thead>
          <tbody>
            {houses?.map((house, index) => (
              <tr key={index}>
                <td>{house?.name}</td>
                <td>{house?.region}</td>
                <td>{house?.titles}</td>
                <td>{house?.swornMembers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default HousesTable;
