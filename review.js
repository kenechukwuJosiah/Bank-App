'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Kenechukwu Josiah Onwe',
  movements: [2000, -100, 5000, 500, 90, -1220, 5000, 1000000],
  interestRate: 2,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'NGN',
  locale: 'en-NG',
};

const account4 = {
  owner: 'Victoria Chiamaka',
  movements: [2000, 1000, 1500, 90, -220, -5000],
  interestRate: 1.1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
  ],
  currency: 'NGN',
  locale: 'en-NG',
};

const account5 = {
  owner: 'Amobi Nwokoye',
  movements: [200, 382, -10000, 1000000, 380],
  interestRate: 2,
  pin: 5555,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
  ],
  currency: 'NGN',
  locale: 'en-NG',
};

const account6 = {
  owner: 'Obinna Onwe',
  movements: [
    2000, 100, 50, -100, -500, 1000, -300, -1000, 500, 90, -220, 5000,
  ],
  interestRate: 1.2,
  pin: 1237,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2021-06-25T18:49:59.371Z',
    '2021-07-25T18:49:59.371Z',
    '2021-09-25T18:49:59.371Z',
    '2021-19-25T18:49:59.371Z',
    '2021-10-25T18:49:59.371Z',
    '2021-23-26T12:01:20.894Z',
  ],
  currency: 'NGN',
  locale: 'en_NG',
};

const accounts = [account1, account2, account3, account4, account5, account6];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
//currentUser
let currentAccount, timer;

//creating user name
const UserName = accs => {
  accs.map(acc => {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
UserName(accounts);

//functions

// format time mov
const formatcurrency = (value, locale, currency) => {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

//Display Movement
const updatingMovements = (acc, sort = false) => {
  containerMovements.textContent = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  //Internationaizing Date
  const displayDate = (date, locale) => {
    const daysCalc = (date1, date2) => {
      return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
    };
    const daysPassed = daysCalc(date, new Date());
    if (daysPassed === 0) return 'Today';
    else if (daysPassed === 1) return 'Yesterday';
    else if (daysPassed <= 7) return `${daysPassed} days ago`;
    return new Intl.DateTimeFormat(locale).format(date);
  };
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    // const formatedDate = dateFormat(date, acc.locale);
    const formatedDate = displayDate(date, acc.locale);
    const formatedMov = formatcurrency(mov, acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${i + 1} ${type}
        </div>
        <div class="movements__date">${formatedDate}</div>
        <div class="movements__value">${formatedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Updating ui
const updateUI = currentAccount => {
  //updating movement
  updatingMovements(currentAccount);
  //updating balace
  calcDisplayBalance(currentAccount);
  //updating Summery
  calcDisplaySummary(currentAccount);
};
//Update Balance
const calcDisplayBalance = acc => {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(balance);
};
//TIMER
const timerFunction = function () {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //changing time in each call
    labelTimer.textContent = `${min}:${sec}`;
    //logout when timer is 0
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }

    time--;
  };
  let time = 300;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
//CALC SUMMERY
const calcDisplaySummary = acc => {
  //total Deposit
  const deposit = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatcurrency(deposit, acc.locale, acc.currency);
  //total Withdrawal
  const withdrawals = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatcurrency(
    withdrawals,
    acc.locale,
    acc.currency
  );
  //Interest Rate
  const interestRate = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * currentAccount.interestRate) / 100)
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formatcurrency(
    interestRate,
    acc.locale,
    acc.currency
  );
  console.log();
};
//Events Handlers
//LOGIN
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    acc =>
      acc.username === inputLoginUsername.value &&
      acc.pin === +inputLoginPin.value
  );
  if (inputLoginUsername.value === currentAccount?.username) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //updating ui
    updateUI(currentAccount);
    //timer
    if (timer) clearInterval(timer);
    timer = timerFunction();
    //setting date
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, {
      year: 'numeric',
      month: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
    }).format(new Date());
    //updating input area
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();
  } else alert('Wrong Credentials Nigga');
});

//TRANSFER
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const reciver = accounts.find(acc => acc.username === inputTransferTo.value);
  const ammount = +inputTransferAmount.value;
  const balanceValue = Number(
    labelBalance.textContent.slice(1).split(',').join('')
  );

  if (
    ammount > 0 &&
    reciver?.username !== currentAccount.username &&
    ammount <= balanceValue
  ) {
    //updating movements for current account
    currentAccount.movements.push(-ammount);
    //updating movements for reciver
    reciver.movements.push(ammount);
    //updating date movs
    currentAccount.movementsDates.push(new Date().toISOString());
    reciver.movementsDates.push(new Date().toISOString());
    //timer
    clearInterval(timer);
    timer = timerFunction();
    //updating ui
    updateUI(currentAccount);
    inputTransferTo.value = inputTransferAmount.value = '';
  } else alert('Insufficent Fund 😏😏🙄');
});

//REQUESTING FOR LOAN
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const loan = +inputLoanAmount.value;
  //Checking Eligibility
  if (loan > 0 && currentAccount.movements.some(mov => mov >= loan * 0.1)) {
    currentAccount.movements.push(loan);
    //updating date movs
    currentAccount.movementsDates.push(new Date());
    clearInterval(timer);
    timer = timerFunction();
    //updating ui
    updateUI(currentAccount);
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  } else alert('Not Eligble for this offer 😋😋');
});

//DELETING ACCOUNT
btnClose.addEventListener('click', e => {
  e.preventDefault();
  const Acc = accounts.findIndex(
    acc => acc.username === inputCloseUsername.value
  );
  //validating user
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    accounts.splice(Acc, 1);
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

//Sorting movement
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  updatingMovements(currentAccount, !sorted);
  sorted = !sorted;
});
