import { Redirect, Route } from 'react-router-dom';
import React, { useRef, useState, useEffect } from "react";
import {
  IonApp,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonPage,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import Map from "./components/Map";
import Login from "./pages/Login";
import ChargePointDetail from './pages/ChargePointDetail';
import { IonReactRouter } from '@ionic/react-router';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Modal from "./components/Modal";

setupIonicReact();

const App: React.FC = () => {
  const [selectedChargePoint, setSelectedChargePoint] = useState<{
    id: number;
    stationName: "string"
  }>()
  // const dismissSelectedChargePoint = () => {
  //   setSelectedChargePoint(undefined)
  // }
  const [loggedIn, setIsLoggedIn] = useState<Boolean>(false);
  const [did, setDid] = useState<string>("")
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login">
            <Login setDid={setDid}/>
          </Route>
          <Route exact path="/map">
            <Map setSelectedChargePoint={setSelectedChargePoint} selectedChargePoint={selectedChargePoint}></Map>
          </Route>
          <Route exact path="/detail">
            <ChargePointDetail chargePoint={selectedChargePoint}/>
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
};
// docs on Ionic Router: https://ionicframework.com/docs/react/navigation
export default App;
