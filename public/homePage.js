//  Выход из личного кабинета
const logoutBtn = new LogoutButton();

logoutBtn.action = () => {
    ApiConnector.logout((response) => {
        if (response.success) {
            location.reload(); 
        }
    });
}

// Получение информации о пользователе

ApiConnector.current((response) => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

//  Получение текущих курсов валюты

const tableBody = new RatesBoard();

function getRates() {
    ApiConnector.getStocks(response => {
        if (response.success) {
            tableBody.clearTable();
            tableBody.fillTable(response.data); 
        }
    });
}
getRates();

setInterval(() => {
    getRates();
}, 60000);

// Операции с деньгами
const moneyManager = new MoneyManager();

// пополнение баланса
moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Cчет успешно пополнен");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
}

// Конвертация валют
moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Конвертация успешно совершена");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
}

// Перевод валюты

moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Перевод выполнен");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
}

// Работа с избранным

const favoritesWidget = new FavoritesWidget();

// Запрос начального списка
ApiConnector.getFavorites(response => {
    if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
        console.log(response);
    }
});

//  Добавление пользователя в список избранных
favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь успешно добавлен");
            console.log(response);
        } else {
            favoritesWidget.setMessage(false, response.error);
        }
    });
}

//  Удаление пользователя из избранного
favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь удален");
            console.log(response);
        } else {
            favoritesWidget.setMessage(false, response.error);
        }
    });
}