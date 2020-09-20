import React, { useState } from 'react'

function SignUp(props) {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailErr, setEmailErr] = useState("")
    const [passwordErr, setPasswordErr] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email === "") {
            setEmailErr("Please enter an email.")
        }
        if (password === "") {
            setPasswordErr("Please enter a password.")
        }
        if (email !== "" && password !== "") props.auth()
    }

    return (
        <div style={{
            display: 'block',
            textAlign: 'center',
        }}>
            <form style={{
                display: 'inline-block',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '15rem',
                textAlign: 'left',
                width: '30rem',
                borderWidth: 2,
                borderColor: '#526B83',
                borderStyle: 'solid',
                padding: 25
            }}>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => {
                        setEmail(e.target.value)
                        setEmailErr("")
                    }} required />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    <p style={{ backgroundColor: '#ffcccb' }}>
                        {emailErr}
                    </p>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" onChange={(e) => {
                        setPassword(e.target.value)
                        setPasswordErr("")
                    }} required />
                    <p style={{ backgroundColor: '#ffcccb' }}>
                        {passwordErr}
                    </p>
                </div>
                <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
            </form>
        </div >

    )
}

export default SignUp;