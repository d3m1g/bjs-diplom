"use strict"

const userForm = new UserForm();
userForm.loginFormCallback = data => ApiConnector.login(data, response => {
 if (response.success === false) {
  return userForm.setLoginErrorMessage(response.error);
 }
 location.reload();
});

userForm.registerFormCallback = newData = ApiConnector.register(newData, response => {
 if(response.succes === false) {
  return userForm.setRegisterErrorMessage(response.error);
 }
 location.reload();
});