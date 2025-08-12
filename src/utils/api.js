
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
        return "http://localhost:30001/admin/"
    }
    else if(process.env.NODE_ENV === "demo") {
        return "https://cp-api-demo.al-jariyah.com/admin/"
    }
    else if(process.env.NODE_ENV === "production") {
        return "https://cp-api.al-jariyah.com/admin/"
    }
    else {
        return "http://localhost:30001/admin/"
    }
}

const GET__ENV2 = () => {
    if(process.env.NODE_ENV === "development") {
        return "http://localhost:30001/sysadmin/"
    }
    else if(process.env.NODE_ENV === "demo") {
        return "https://cpdemo.infaqyide.xyz/sysadmin/"
    }
    else if(process.env.NODE_ENV === "production") {
        return "https://cp.infaqyide.com.my/sysadmin/"
    }
    else {
        return "http://localhost:30001/sysadmin/"
    }
}

export const API = async (name = "", body = null, method = "POST", auth = true ) => {

    let base_url = GET__ENV()

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if(auth === true) {
        let token = sessionStorage.getItem("token")
        myHeaders.append("token", token)
    }

    let response    = bad_respnse
    let config      = {}

    if(method === "POST") {
        config = {
            method: method,
            headers: myHeaders,
            body: JSON.stringify(body),
            redirect: 'follow',
            //mode: 'no-cors'
        }
    }
    else if(method === "GET") {
        config = {
            method: method,
            headers: myHeaders,
            //mode: 'no-cors'
        }
    }

    try {

        await fetch(base_url + name, config)
        .then(res => res.json())
        .then(a => {
            response = a

            if(a.status_code === 401) {
                sessionStorage.clear()
                localStorage.clear()
                window.location.href = "/"
            }
        })
        .catch(e => {
            response = e
        })
        
    } catch (e) {
        console.log("Syntax error while executing API : ", e)
        response = bad_respnse
    }

    return response

}

export const SYSADMIN_API = async (name = "", body = null, method = "POST", auth = true ) => {

    let base_url = GET__ENV2()

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if(auth === true) {
        let token = sessionStorage.getItem("token")
        myHeaders.append("token", token)
    }

    let response    = bad_respnse
    let config      = {}

    if(method === "POST") {
        config = {
            method: method,
            headers: myHeaders,
            body: JSON.stringify(body),
            redirect: 'follow',
            //mode: 'no-cors'
        }
    }
    else if(method === "GET") {
        config = {
            method: method,
            headers: myHeaders,
            //mode: 'no-cors'
        }
    }

    try {

        await fetch(base_url + name, config)
        .then(res => res.json())
        .then(a => {
            response = a

            if(a.status_code === 401) {
                sessionStorage.clear()
                localStorage.clear()
                window.location.href = "/"
            }
        })
        .catch(e => {
            response = e
        })
        
    } catch (e) {
        console.log("Syntax error while executing API : ", e)
        response = bad_respnse
    }

    return response

}

export default async function API_FORM_DATA(API_NAME = "", DATA = [], METHOD = "POST", AUTH = true) {

    let result          = { status_code: null, status: null, message: null, body: null }
    let raw             = null
    let requestOptions  = null
    let BASE_URL        = GET__ENV()
    
    var myHeaders = new Headers();
    myHeaders.append("token", sessionStorage.getItem("_aT"));

    let form__data = new FormData()
    for (let i = 0; i < DATA.length; i++) {
        form__data.append(DATA[i]["title"], DATA[i]["value"])
    }

    console.log("Log Form Data : ", form__data)

    requestOptions = {
        method: METHOD,
        headers: myHeaders,
        body: form__data,
        redirect: 'follow'
    };    

    await fetch(BASE_URL + API_NAME, requestOptions)
    .then(response => response.json())
    .then(res => {
        console.log("Log Upload Form Data : ", res)
        result = res
    })
    .catch(error => {
        console.log('error', error)
        result = error
    });

    return result
}

export async function API_FORM_DATA_STAGING(API_NAME = "", DATA = [], METHOD = "POST", AUTH = true) {

    let result          = { status_code: null, status: null, message: null, data: null }
    let requestOptions  = null
    
    var myHeaders = new Headers();
    myHeaders.append("token", sessionStorage.getItem("_aT"));

    let form__data = new FormData()
    for (let i = 0; i < DATA.length; i++) {
        form__data.append(DATA[i]["title"], DATA[i]["value"])
    }

    console.log("Log Form Data : ", form__data)

    requestOptions = {
        method: METHOD,
        headers: myHeaders,
        body: form__data,
        redirect: 'follow'
    };    

    await fetch("https://cp-api-demo.al-jariyah.com/admin/file-uploader", requestOptions)
    .then(response => response.json())
    .then(res => {
        console.log("Log Upload Form Data : ", res)
        result = res
    })
    .catch(error => {
        console.log('error', error)
        result = error
    });

    return result
}

