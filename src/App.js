/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import visitorInfo from "visitor-info";

function App() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [response, setResponse] = useState([]);
  const [userInfos, setUserInfos] = useState([]);
  const [ipAddress, setIpAddress] = useState([]);

  // function errors(err) {
  //   console.warn(`ERROR(${err.code}): ${err.message}`);
  // }

  // Get current position of the user
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  }, []);

  const position = [latitude, longitude];

  useEffect(() => {
    axios
      .get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`
      )
      .then((res) => {
        const city = res.data;
        setResponse(city);
        localStorage.setItem("city", JSON.stringify(city));
      })
      .catch((err) => {
        console.log(err.message);
        let collection = localStorage.getItem("city");
        setResponse(JSON.parse(collection));
      });
    setUserInfos([visitorInfo()]);
    console.log("locality :", response);
    console.log("User Infos :", userInfos);
    console.log("Ip Address :", ipAddress.ip);
  }, [latitude, longitude]);

  useEffect(() => {
    async function getIpClient() {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        console.log(response);
        setIpAddress(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    getIpClient();
  }, []);

  const MapContent = () => (
    <MapContainer
      className="map"
      center={position}
      zoom={14}
      style={{ width: "100%", height: "366px" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          <b style={{ textAlign: "center !important" }}>
            &emsp;&emsp;&ensp;Vous êtes ici!
          </b>{" "}
          <br />
        </Popup>
      </Marker>
    </MapContainer>
  );

  return (
    <div className="App">
      <br />
      {ipAddress.ip !== undefined && (
        <h1>{`Votre adresse ip : ${ipAddress.ip}`}</h1>
      )}
      <hr style={{ width: "100%" }} />
      <h2>{`Votre code postal est : ${response.postcode}`}</h2>
      <h3>{`Votre localité est: ${response.locality}`}</h3>
      {userInfos.map((res, i) => (
        <span key={i}>
          <h4>{`votre drapeau est ${res.country.emoji}`}</h4>
          <h5>{`Votre timeZone est : ${res.timezone.name}`}</h5>
          <hr style={{ width: "100%" }} />
          {res.cpu.architecture !== undefined && (
            <h3>{`Votre architecture est : ${res.cpu.architecture}`}</h3>
          )}
          <h3>{`Votre Navigateur est : ${res.browser.name}`}</h3>
          <h3>{`votre système d'exploitation est: ${res.os.name}`}</h3>
          <h4>{`en version ${res.os.version}`}</h4>
          <hr style={{ width: "100%" }} />
          {res.device.model !== undefined && (
            <Fragment>
              <h3>{`Votre téléphone est : ${res.device.model}`}</h3>
              <h4>{` de marque ${res.device.vendor}`}</h4>
            </Fragment>
          )}
        </span>
      ))}

      <div className="content-map">
        <MapContent />
      </div>
    </div>
  );
}

export default App;
