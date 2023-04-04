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
import { resetPassword } from '../auth/actions/userActions';
import {useHistory, useParams} from "react-router-dom";

const PasswordReset = ({resetPassword}) => {
    const history = useHistory()
    const {accessToken} = useParams()
    return (
        <div>
            <StyledFormArea>
                <Avatar image={Logo} />
                <StyledTitle color={colors.theme} size={30}>
                    Password Reset
                </StyledTitle>
                <Formik
                    initialValues={{
                        newPassword: "",
                        confirmNewPassword: "",
                        accessToken,
                        // resetString
                    }}
                    validationSchema={
                        Yup.object({
                            newPassword: Yup.string().required("Required"),
                            confirmNewPassword: Yup.string().required("Required")
                            .oneOf([Yup.ref("newPassword")], "Passwords must match")
                        })
                    }
                    onSubmit={(values, {setSubmitting, setFieldError}) => {
                        
                        resetPassword(values, history, setFieldError, setSubmitting, accessToken)
                    }}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <TextInput 
                                name="newPassword"
                                type="password"
                                label="New Password"
                                placeholder="********"
                                icon={<FiLock />}
                            />

                            <TextInput 
                                name="confirmNewPassword"
                                type="password"
                                label="Confirm New Password"
                                placeholder="********"
                                icon={<FiLock />}
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

export default connect(null, {resetPassword})(PasswordReset);