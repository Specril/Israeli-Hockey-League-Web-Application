import DropdownTable from "../DropdownTable";
import "../style.css";
import Table from "../Table";

export default async function Home() {
  // Fetch data on the server side
  //const data_goal_king = await dataFetchGoalKing();
  const options = ["1", "2", "3"];
  return (
    <>
      <DropdownTable
        dropdownOptions={options}
      />
    </>
  );
}
