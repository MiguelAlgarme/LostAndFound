import ListGroup from "./components/ListGroup";
import Alert from "./components/Alert";
import Button from "./components/Button";
import { useState } from "react";
//import "./tailwind.css";
//import TWButton from "./components/TWButton";
import "./App.css";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import About from "./pages/About";
import Form from "./pages/CreateForm";
import Profile from "./pages/Profile";
//import PreLoader from "./pages/PreLoader.jsx"; //YOU CAN IGNORE THIS, THIS IS JUST FOR ANIMATIONS
import { Route, Routes } from "react-router-dom";
import Logout from "./components/Logout";

function App() {
  const [user, setUser] = useState(null);
  const [alertVisible, setAlertVisibility] = useState(false); //Sets Alert visibility to hide

  let items = [
    //Code won't show if you don't add the listGroup below, active that first.
    "New York",
    "San Francisco",
    "Some City",
    "Another City",
    "Some City too",
  ];

  const handleSelectItem = (item: string) => {
    console.log(item);
  };

  let comp;
  //  <Route path="/" element={<PreLoader />} /> ADD THIS TO ADD ANIMATIONS
  //Button Progress Checker
  return (
    <div>
      <Nav user={user} />
      <div className="container1">
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Form" element={<Form />} />
          <Route path="/About" element={<About />} />
        </Routes>
      </div>

      {alertVisible && (
        <Alert
          onClose={() => setAlertVisibility(false)}
          text="Work in progress"
        />
      )}
      <Button
        onClick={() => setAlertVisibility(true)}
        text="Announcements"
        color="primary"
      ></Button>
    </div>
  );
}
//  <ListGroup
//items={items}
//heading="Cities"
//onSelectItem={handleSelectItem}
///>

export default App;
