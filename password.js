const pass = document.getElementById('password');
const btn = document.getElementById('checkpassword');


    // /^            : Start
    // (?=.{8,})        : Length
    // (?=.*[a-zA-Z])   : Letters
    // (?=.*\d)         : Digits
    // (?=.*[!#$%&? "]) : Special characters
    // $/

// function checkPassword(str)
// {
//     var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
//     return re.test(str);
// }


btn.addEventListener('click', () => {
    console.log(pass.value);
});