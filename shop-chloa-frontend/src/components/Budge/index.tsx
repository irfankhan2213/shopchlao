import React from "react";

function Budge({ label }: { label: string }) {
  switch (label.toLocaleLowerCase()) {
    case "inactive":
      return <div className="bg-orange-500  bg-opacity-65 text-white p-1 px-2 rounded-lg">{label}</div>;
    default:
     return <div className="bg-green-600 bg-opacity-65 text-white p-1 px-2 rounded-lg">{label}</div>;
  }
}

export default Budge;
