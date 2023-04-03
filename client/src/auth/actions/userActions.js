import axios from 'axios'
import { sessionService } from 'redux-react-session'

export const signUpUser = (credentials, history, setFieldError, setSubmitting) => {
    axios.post("http://localhost:8080/api/users/signup/",
    credentials,
    {
        headers: {
            "Content-Type": "application/json"
        }
    }
    )
}

export const loginUser = (credentials, navigate, setFieldError, setSubmitting) => {
    // check for user details 

    axios.post("http://localhost:8080/api/users/signin/",
    credentials,
    {
        headers: {
            "Content-Type": "application/json"
        }
    }
    ).then((response) => {
        const {data} = response

        if(data.error === "Unauthorized" || data.error === "Bad Request") {
            const {message} = data;

            // check for specific error
            if(message.includes("Unauthorized")) {
                setFieldError("email", message);
                setFieldError("password", message);
            } else if (message.includes("password")) {
                setFieldError("password", message)
            }
        } else if (data.status === "SUCCESS") {
            const userData = data

            const token = userData.id
            sessionService.saveSession(token).then(() => {
                sessionService.saveUser(userData).then(() => {
                    navigate("/dashboard")
                }).catch(err => console.error(err))
            }).catch(err => console.error(err))
        }

        setSubmitting(false);
    }).catch(err => console.error(err))
}

export const logoutUser = () => {
    
}