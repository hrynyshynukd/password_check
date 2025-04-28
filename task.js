const fs = require('fs');
const prompt = require('prompt');
const crypto = require('crypto');

const passwordFile = 'password.txt';

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

prompt.start();

if (fs.existsSync(passwordFile)) {
    const savedHash = fs.readFileSync(passwordFile, 'utf8').trim();

    if (savedHash.length > 0) {
        console.log('Введіть свій пароль для перевірки:');
        prompt.get(['password'], function (err, result) {
            if (err) {
                console.log('Сталася помилка.');
                return;
            }

            const enteredPassword = result.password;
            const enteredHash = hashPassword(enteredPassword);

            if (enteredHash === savedHash) {
                console.log('Пароль правильний!');
            } else {
                console.log('Невірний пароль!');
            }
        });

    } else {
        createNewPassword();
    }

} else {
    createNewPassword();
}

function createNewPassword() {
    console.log('Файл з паролем не знайдено або він порожній.');
    console.log('Створіть новий пароль:');
    prompt.get(['password', 'confirmPassword'], function (err, result) {
        if (err) {
            console.log('Сталася помилка.');
            return;
        }

        const password = result.password;
        const confirmPassword = result.confirmPassword;

        if (password !== confirmPassword) {
            console.log('Паролі не співпадають! Спробуйте ще раз.');
            return;
        }

        const hash = hashPassword(password);

        fs.writeFileSync(passwordFile, hash);
        console.log('Пароль успішно створено і записано у файл password.txt!');
    });
}
