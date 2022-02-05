import React from "react";
import MetaMaskIcon from "../assets/login-icons/metamask-icon.svg";
import WalletConnectIcon from "../assets/login-icons/wallet-connect-icon.svg";
import { IonModal, IonContent, IonPage, IonCard, IonButton, IonTitle, IonCardContent, IonMenuButton, IonGrid, IonRow, IonCol, IonHeader, IonImg } from '@ionic/react';
import Login from "../pages/Login";
import styled from "styled-components";
import EliaLogo from "../assets/EliaVector.png";
import strings from "../constants/strings.json";
import "./login-options.css"
// import { ProviderType } from "iam-client-lib";
interface LoginOptionsProps {
    loginMethod: any
}


const LoginOptions = (props: LoginOptionsProps) => {
    const { loginMethod } = props;
    const handleSelectMetamask = async () => {
        console.log("selected Metamask")
        loginMethod();
    }

    const handleSelectWalletConnect = async () => {
        console.log("selected Wallet Connect")
    }

    const MetaMaskLogin = styled(IonButton)`
        --background: white;
        --border-radius: 6px
    `

    const TitleHeader = styled.div`
    color: white;
    text-align: center;
    font-size: 48px;
    line-height: 58px;
    text-align: center;
    letter-spacing: 0.4px;
    `

    return (
        <div>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonImg src={EliaLogo} style={{
                            height: "130px",
                            marginTop: "200px"
                        }}>
                        </IonImg>
                    </IonCol>
                </IonRow>
                <IonRow >
                    <IonCol class="ion-align-items-center ion-align-self-center">
                            <TitleHeader>
                                {strings.eliaRebeam}
                            </TitleHeader>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol className="login-button">
                        <MetaMaskLogin expand="block"
                            onClick={handleSelectMetamask}
                            style={{
                                height: "54px",
                            }}
                        >
                            <IonImg
                                class="ion-float-left"
                                slot="start"
                                src={MetaMaskIcon}
                                alt="MetaMask Logo"
                                style={{
                                    height: "38px",
                                    width: "38px",
                                    margin: "10px"
                                }}

                            ></IonImg>
                            <span style={{
                                fontSize: "16px",
                                color: "black"
                            }}>Connect to MetaMask</span>
                        </MetaMaskLogin>

                    </IonCol>
                </IonRow>
            </IonGrid>

        </div>
    )

}

export default LoginOptions