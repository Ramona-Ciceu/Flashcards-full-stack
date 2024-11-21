import React, { useEffect, useState } from "react";

interface Set {
  id: string;
  name: string;
  description: string;
  
}

const SetsPage: React.FC = () => {
  const [sets, setSets] = useState<Set[]>([]);

  useEffect(() => {
    fetch("/api/set")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: Set[]) => {
        setSets(data);
      })
      .catch((error) => {
        console.error("Error fetching sets:", error);
      });
  }, []);

  return (
    <div>
      <h1>Sets</h1>
      <ul>
        {sets.map((set) => (
          <li key={set.id}>
            <h2>{set.name}</h2>
            <p>{set.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SetsPage;

