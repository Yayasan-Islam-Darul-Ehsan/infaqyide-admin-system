
let response = {
    status_code: 200,
    status: 'Success',
    message: 'success',
    data: null
}

let bad_respnse = {
    status_code: 500,
    status: 'Internal Server Error',
    message: 'Internal Server Error. Please contact our system administrator.',
    data: null
}

const GET__ENV = () => {
    if(process.env.NODE_ENV === "development") {
        return "http://127.0.0.1:2245/admin/"
    }
    else if(process.env.NODE_ENV === "demo") {
        return "https://cp-api-demo.al-jariyah.com/admin/"
    }
    else if(process.env.NODE_ENV === "production") {
        return "https://cp-api.al-jariyah.com/admin/"
    }
    else {
        return "http://127.0.0.1:1122/admin/"
    }
}

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

export const AUTH__LOGIN = async (userNaEm, password) => {

    let base_url    = GET__ENV()
    let result      = response

    try {
        let json = {
            userNaEm,
            password
        }

        let config = {
            method: 'post',
            headers: myHeaders,
            body: JSON.stringify(json),
            redirect: 'follow',
            //mode: 'no-cors'
        }

        await fetch(base_url + "login", config)
        .then(res => res.json())
        .then(a => {
            result = a
            result.data = a.data
        })
        .catch(e => {
            result = e
        })
    } catch (e) {
        console.log("Catch try error function login : ", e)
        result = bad_respnse   
    }
    return result
}


export const FETCH__LIST__ORGANIZATION = async () => {

    let base_url    = GET__ENV()
    let result      = response

    try {
        await fetch(base_url + "organization/list")
        .then(res => res.json())
        .then(a => {    
            result = a
            result.data = a.body
        }).catch(e => {
            console.log("Catch fetch error : ", e)
            result = bad_respnse
        })
    } catch (e) {
        console.log("Catch try error : ", e)
        result = bad_respnse   
    }
    return result
}