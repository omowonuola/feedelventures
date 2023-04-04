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
import { forgottenPassword } from '../auth/actions/userActions';
import {useHistory, useParams} from "react-router-dom";

const ForgottenPassword = ({forgottenPassword}) => {
    const history = useHistory()
    const {userEmail} = useParams()
    return (
        <div>
            <StyledFormArea>
                <Avatar image={Logo} />
                <StyledTitle color={colors.theme} size={30}>
                    Password Reset
                </StyledTitle>
                <Formik
                    initialValues={{
                        email: userEmail,
                        redirectUrl: "http://locathost:3000/passwordreset/"
                    }}
                    validationSchema={
                        Yup.object({
                            email: Yup.string().email("Invalid email address")
                            .required("Required"),
                        })
                    }
                    onSubmit={(values, {setSubmitting, setFieldError}) => {
                        
                        forgottenPassword(values, history, setFieldError, setSubmitting)
                    }}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <TextInput 
                                name="email"
                                type="text"
                                label="Enter Your Email Address"
                                placeholder="johndoe@gmail.com"
                                icon={<FiMail/>}
                            />

                            <ButtonGroup>
                                {!isSubmitting && (<StyledFormButton type="submit">
                                    Submit
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
            </StyledFormArea>
            <CopyrightText>
                All rights reserved &copy; 2023
            </CopyrightText>
        </div>

    )
}

export default connect(null, {forgottenPassword})(ForgottenPassword);