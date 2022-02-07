import React from "react";
import MetaMaskIcon from "../assets/login-icons/metamask-icon.svg";
import WalletConnectIcon from "../assets/login-icons/wallet-connect-icon.svg";
import { IonButton, IonGrid, IonRow, IonCol, IonImg } from '@ionic/react';
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
        <div style={{
            height: "100%",
            border: "1px solid white"
        }}>
            <IonGrid style={{
                border: "10px solid orange",
                height: "100%",
                display: "flex",
                flexDirection: "column"
                
            }}>
                <IonRow class="ion-align-items-end" style={{
                    border: "3px solid green",
                    height: "80%"
                }}>
                    <IonCol>
                        <IonImg src={EliaLogo} style={{
                            height: "130px",
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
                <IonRow  class="ion-align-items-end" style={{
                    border: "5px solid white",
                    height: "100%"
                    
                }}>
                    <IonCol className="login-button"  style={{
                        border: "1px solid yellow",
                    }}>
                        <MetaMaskLogin expand="block"
                            onClick={handleSelectMetamask}
                            style={{
                                height: "54px"                            }}
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