import {StyledTextInput, StyledFormArea, 
    StyledFormButton, StyledLabel,StyledTitle, 
    Avatar, ButtonGroup, colors, ExtraText, TextLink, CopyrightText} from './../components/Styles';

import Logo from './../assets/logo.png'

// formik
import {Formik, Form} from 'formik';
import {TextInput} from "./../components/FormLib"
import * as Yup from 'yup'


// icons
import {FiMail, FiLock, FiUser} from 'react-icons/fi';

// 
// import Audio from 'react-loader-spinner';

// auth & redux
import {connect} from 'react-redux';
import { signUpUser } from '../auth/actions/userActions';
import {useNavigate} from "react-router-dom";

const Signup = ({signUpUser}) => {
    const history = useNavigate()
    return (
        <div>
            <StyledFormArea>
                <Avatar image={Logo} />
                <StyledTitle color={colors.theme} size={30}>
                    Member Signup
                </StyledTitle>
                <Formik
                    initialValues={{
                        email: "",
                        pasword: "",
                        uername: ""
                    }}
                    validationSchema={
                        Yup.object({
                            email: Yup.string().email("Invalid email address")
                            .required("Required"),
                            password: Yup.string().required("Required"),
                            uername: Yup.string()

                        })
                    }
                    onSubmit={(values, {setSubmitting, setFieldError}) => {
                        signUpUser(values, history, setFieldError, setSubmitting)
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

                            <TextInput 
                                name="username"
                                type="text"
                                label="Username"
                                placeholder="johndoe"
                                icon={<FiUser/>}
                            />
                            <ButtonGroup>
                                {!isSubmitting && (<StyledFormButton type="submit">
                                    Signup
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
                    Already have an account? <TextLink to="/login">Login</TextLink>
                </ExtraText>
            </StyledFormArea>
            <CopyrightText>
                All rights reserved &copy; 2023
            </CopyrightText>
        </div>

    )
}

export default connect(null, {signUpUser})(Signup);