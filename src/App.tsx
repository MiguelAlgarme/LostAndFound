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
import { Route, Routes } from "react-router-dom";

function App() {
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

  //Button Progress Checker
  return (
    <div>
      <Nav />
      <div className="container1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
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
