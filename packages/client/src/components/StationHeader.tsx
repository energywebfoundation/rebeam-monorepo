import { IonGrid, IonRow, IonCol, IonImg } from "@ionic/react";
import React from "react";
import styled from "styled-components";
import ChargeStationImg from "../assets/BuildingImg.png"
import ModalPinIcon from "../assets/ModalPinIcon.png"

const data = {
    stationName: "50Hertz Transmission",
    formattedAddress: "Heidestraße 2, 10557 Berlin, Germany",
    img: ChargeStationImg 
}

const Header = styled.h1`
font-weight: bold;
font-size: 21px;
color: #363636;
margin: 2px 0;
font-family: Arial;
text-align: left;
`

const Address = styled.p`
font-style: normal;
font-weight: normal;
font-size: 12px;
color: #363636;
margin: 0;
padding: 0;
text-align: left;
`
const MapIcon = styled(IonImg)`
`

const MapInfo = styled.p`
font-style: normal;
font-weight: normal;
font-size: 12px;
color: #363636;
margin: 0;
padding: 0;
color: #A466FF;
text-align: left;
`

// const PhotoContainer = styled.div`
// border: "1px solid red";
// borderRadius: "10px";
// backgroundImage: `url(${ChargeStationImg})`;
// backgroundRepeat: "no-repeat";
// backgroundSize:"cover";
// backgroundPosition: "center";
// height: "100%";

// `



const StationHeader = () => {
    return (
        <div>
            <IonGrid style={{
                border: "1px solid yellow",
            }}>
                <IonRow>
                    <IonCol size="3" style={{
                        marginRight: "14px"
                    }}>
                        <div style={{
                            border: "1px solid red",
                            borderRadius: "10px",
                            backgroundImage: `url(${ChargeStationImg})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize:"cover",
                            backgroundPosition: "center",
                            height: "100%"
                        }}>
                        </div>
                    </IonCol>
                    <IonCol>
                        <IonGrid  style={{
                                border: "1px solid green",
                            }}>
                            <IonRow>
                                <IonCol>
                                   <Header>
                                   {data.stationName}
                                    </Header> 
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <Address>{data.formattedAddress}</Address>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <MapIcon src={ModalPinIcon}>
                                </MapIcon>
                                <IonCol>
                                    <MapInfo>{"450m/5m"}</MapInfo>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </div>
    )
}

export default StationHeader;