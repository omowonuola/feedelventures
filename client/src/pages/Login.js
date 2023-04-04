import {StyledTextInput, StyledFormArea, 
    StyledFormButton, StyledLabel,StyledTitle, 
    Avatar, ButtonGroup, colors, ExtraText, TextLink, CopyrightText} from './../components/Styles';

import Logo from './../assets/logo.png'

// formik
import {Formik, Form} from 'formik';
import {TextInput} from "./../components/FormLib"
import * as Yup from 'yup'


// icons
import {FiMail, FiLock} from 'react-icons/fi';

// auth & redux
import {connect} from 'react-redux';
import { loginUser } from '../auth/actions/userActions';
import {useHistory, useParams} from "react-router-dom";

const Login = ({loginUser}) => {
    const history = useHistory()
    const {userEmail} = useParams();
    return (
        <div>
            <StyledFormArea>
                <Avatar image={Logo} />
                <StyledTitle color={colors.theme} size={30}>
                    Member Login
                </StyledTitle>
                <Formik
                    initialValues={{
                        email: userEmail,
                        password: "",
                    }}
                    validationSchema={
                        Yup.object({
                            email: Yup.string().email("Invalid email address")
                            .required("Required"),
                            password: Yup.string().required("Required")
                        })
                    }
                    onSubmit={(values, {setSubmitting, setFieldError}) => {
                        
                        loginUser(values, history, setFieldError, setSubmitting)
                    }}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <TextInput 
                                name="email"
                                type="text"
                                label="Email Address"
                                placeholder="johndoe@gmail.com"
                                icon={<FiMail/>}
                            />

                            <TextInput 
                                name="password"
                                type="password"
                                label="Password"
                                placeholder="********"
                                icon={<FiLock />}
                            />

                            <ButtonGroup>
                                {!isSubmitting && (<StyledFormButton type="submit">
                                    Login
                                </StyledFormButton>)}
                            </ButtonGroup>
{/* 
                            {isSubmitting && (
                                <Audio
                                ariaLabel="ThreeDots"
                                    color={colors.theme}
                                    height="49"
                                    width="100"
                                />
                            )} */}
                        </Form>
                    )}
                </Formik>
                <ExtraText>
                    Forgotten Password? <TextLink to="/forgottenpassword">Reset Password</TextLink>
                </ExtraText>
                <ExtraText>
                    New User? <TextLink to="/signup">Signup</TextLink>
                </ExtraText>
            </StyledFormArea>
            <CopyrightText>
                All rights reserved &copy; 2023
            </CopyrightText>
        </div>

    )
}

export default connect(null, {loginUser})(Login);