import { StyledTitle, StyledSubTitle, Avatar, StyledButton, ButtonGroup, StyledFormArea, colors, ExtraText } from "../components/Styles";

// Logo
import Logo from "./../assets/logo.png"

// auth & redux
import { connect } from 'react-redux'
import { logoutUser } from "../auth/actions/userActions";
import {useHistory, useParams} from 'react-router-dom'


const EmailSent = () => {
    const {userEmail, reset} = useParams();
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
            {reset && userEmail && (
                <StyledFormArea bg={colors.dark2}>
                    <StyledTitle size={65}>
                        Password Reset
                    </StyledTitle>
                    <ExtraText color={colors.light1}>An email to reset password link has been sent to your email:
                        <b style={{color: colors.primary}}>{userEmail}</b>
                    </ExtraText>
                    <ExtraText color={colors.light1}>
                        Check your email and click on the link to proceed!
                    </ExtraText>
                </StyledFormArea>
            )}

            {!reset && !userEmail && (
                <StyledFormArea bg={colors.dark2}>
                    <StyledTitle size={65}>
                        Password Reset
                    </StyledTitle>
                    <ExtraText color={colors.light1}>
                        Your password has been reset successfully.
                    </ExtraText>
                    <ExtraText color={colors.light1}>
                        You may now login!
                    </ExtraText>
                    <ButtonGroup>
                        <StyledButton to={'/login'}>
                            Login
                        </StyledButton>
                    </ButtonGroup>
                </StyledFormArea>
            )}
        </div>
    )
}

export default EmailSent;