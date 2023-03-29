'use strict'

const logout = new LogoutButton();
logout.action = () => ApiConnector.logout(response => {
 if (response.success) {
  location.reload();
 }
});

ApiConnector.current(response => {
 if (response.success) {
  ProfileWidget.showProfile(response.data);
 }
});

const rates = new RatesBoard();
function ratesUpdate() {
 ApiConnector.getStocks(response => {
  if (response.success) {
   rates.clearTable();
   rates.fillTable(response.data);
  }
 });
}
setInterval(ratesUpdate(), 60000);

const manager = new MoneyManager();
manager.addMoneyCallback = replenBalance => ApiConnector.addMoney(replenBalance, response => {
 if (response.success) {
  ProfileWidget.showProfile(response.data);
  return manager.setMessage(true, 'Счёт успешно пополнен на ' + replenBalance.amount + ' ' + replenBalance.currency);
 }
 return manager.setMessage(false, response.error);
});

manager.conversionMoneyCallback = conversion => ApiConnector.convertMoney(conversion, response => {
 if (response.success) {
  ProfileWidget.showProfile(response.data);
  return manager.setMessage(true, 'Конвертация прошла успешно ' + conversion.fromAmount + ' ' + conversion.fromCurrency);
 }
 return manager.setMessage(false, 'Ошибка: ' + response.error);
});

manager.sendMoneyCallback = currencyTransfer => ApiConnector.transferMoney(currencyTransfer, response => {
 if (response.success) {
  ProfileWidget.showProfile(response.data);
  return manager.setMessage(true, 'Перевод выполнен ' + currencyTransfer.amount + ' ' + currencyTransfer.currency + ' получателю ' + currencyTransfer.to);
 }
 return manager.setMessage(false, 'Ошибка: ' + response.error);
});


const favorite = new FavoritesWidget;
ApiConnector.getFavorites(response => {
 if (response.success) {
  favorite.clearTable();
  favorite.fillTable(response.data);
  manager.updateUsersList(response.data);
  return;
 }
});

favorite.addUserCallback = addUser => ApiConnector.addUserToFavorites(addUser, response => {
 if (response.success) {
  favorite.clearTable();
  favorite.fillTable(response.data);
  manager.updateUsersList(response.data);
  return favorite.setMessage(true, 'Пользователь добавлен: ' + addUser.name);
 }
 return favorite.setMessage(false, 'Ошибка: ' + response.error);
});

favorite.removeUserCallback = removeUser => ApiConnector.removeUserFromFavorites(removeUser, response => {
 if (response.success) {
  favorite.clearTable();
  favorite.fillTable(response.data);
  manager.updateUsersList(response.data);
  return favorite.setMessage(true, 'Пользователь удалён: ' + removeUser);
 }
 return favorite.setMessage(false, 'Ошибка: ' + response.error);
});