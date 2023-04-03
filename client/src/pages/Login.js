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
import {useNavigate} from "react-router-dom";

const Login = ({loginUser}) => {
    const navigate = useNavigate()
    return (
        <div>
            <StyledFormArea>
                <Avatar image={Logo} />
                <StyledTitle color={colors.theme} size={30}>
                    Member Login
                </StyledTitle>
                <Formik
                    initialValues={{
                        email: "",
                        pasword: "",
                    }}
                    validationSchema={
                        Yup.object({
                            email: Yup.string().email("Invalid email address")
                            .required("Required"),
                            password: Yup.string().required("Required")
                        })
                    }
                    onSubmit={(values, {setSubmitting, setFieldError}) => {
                        console.log(values)
                        loginUser(values, navigate, setFieldError, setSubmitting)
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