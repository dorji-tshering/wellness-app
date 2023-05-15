export const emailValidate = (email: string, registering = false) => {
    const allowedEmails = ['dorji@gmail.com', 'tshering@gmail.com', 'abc@gmail.com', 'sangay@gmail.com'];

    if(email) {
        if(email.trim() === '') {
            return 'Email is required';
        }else if(!email.includes('@')) { 
            return 'Email must contain @ symbol';
        } else if(email.includes('@')) {
            let input = document.createElement('input');
            input.type = 'email';
            input.required = true;
            input.value = email;
            let validity = typeof input.checkValidity === 'function' ? input.checkValidity() : /\S+@\S+\.\S+/.test(email);
    
            if(!validity) {
                return 'Email is invalid';
            } else {
                if(registering && !allowedEmails.includes(email)) {
                    return 'Email is not allowed';
                } else {
                    return undefined;
                }
            }
        } 
    }
}

export const passwordValidate = (password: string) => {
    if(password) {
        if(password.trim() === '') {
            return "Password can't have space";
        } else if(password.trim().length < 6) {
            return 'Password must contain at least 6 characters.';
        }else {
            return undefined;
        }
    }
}