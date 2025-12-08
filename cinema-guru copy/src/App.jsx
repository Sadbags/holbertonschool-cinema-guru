// src/App.jsx
import { useState } from "react";
import Input from "./components/general/Input";
import Selectinput from "./components/general/Selectinput";
import Button from "./components/general/Button";
import SearchBar from "./components/general/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [text, setText] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [search, setSearch] = useState("");

  const options = [
    { label: "Opción 1", value: "1" },
    { label: "Opción 2", value: "2" },
  ];

  const handleClick = () => {
    alert("Botón clickeado!");
  };

  return (
    <div className="App" style={{ padding: "20px" }}>
      <h1>Task 2 - Componentes Generales</h1>

      <Input
        label="Nombre"
        value={text}
        setValue={setText}
        icon={<FontAwesomeIcon icon={faUser} />}
        placeholder="Escribe tu nombre"
      />

      <SelectInput
        label="Selecciona una opción"
        value={selectValue}
        setValue={setSelectValue}
        options={options}
      />

      <Button label="Clic aquí" onClick={handleClick} />

      <SearchBar title={search} setTitle={setSearch} />
    </div>
  );
}

export default App;
