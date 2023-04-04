import { StyledTitle, StyledSubTitle, Avatar, StyledButton, ButtonGroup, StyledFormArea, colors } from "../components/Styles";

// Logo
import Logo from "./../assets/logo.png"

// auth & redux
import { connect } from 'react-redux'
import { logoutUser } from "../auth/actions/userActions";
import {useHistory} from 'react-router-dom'
import React, { useState } from 'react';

const Dashboard = ({logoutUser}) => {
    const [buttonColor, setButtonColor] = useState("green");
    const history = useHistory()
    return (
        <div>
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    backgroundColor: "transparent",
                    width: "100%",
                    padding: "15px",
                    display: "flex",
                    justifyContent: "flex-start"
                }}
            >
                <Avatar image={Logo} />
            </div>
            <StyledFormArea bg={colors.dark2}>
                <StyledTitle size={65}>
                    Welcome To Color Changing App
                </StyledTitle>
                    <StyledButton
                        to="#"
                        onClick={() => {
                            setButtonColor(buttonColor === "green" ? "red" : "green");
                        }}
                        style={{ backgroundColor: buttonColor }}
                    >
                        Change The Color Of This Button
                    </StyledButton>

                <ButtonGroup>
                    <StyledButton to="#" onClick={() => logoutUser(history)}>Logout</StyledButton>
                </ButtonGroup>
            </StyledFormArea>
        </div>
    )
}

export default connect(null, {logoutUser})(Dashboard);