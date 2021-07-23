'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Kenechukwu Josiah Onwe',
  movements: [2000, 1000, -300, 1000, 500, 90, -220, 5000],
  interestRate: 2,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

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
let currentAccount;

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
//Updating the Movements
const displayMovement = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a,b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// Calculating and displaying the Summery
const calcDisplaySummery = acc => {
  labelSumOut.textContent = `0.00€`;
  //Money coming in
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc,mov,i,arr) => acc + mov,0);
  labelSumIn.textContent = `${incomes}€`;
  //Money going out
  const outPuts = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => {
      return acc + mov;
    });
  labelSumOut.textContent = `${Math.abs(outPuts)}€`;
  //Interest Rate
  const interest = acc.movements
    .filter(int => int > 0)
    .map(int => (int * currentAccount.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, int, i, arr) => acc + int);
  labelSumInterest.textContent = `${Math.trunc(interest)}€`;
};
//Calculating and Updating the Balance
const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov, i, arr) => {
    return acc + mov;
  });
  labelBalance.textContent = `${acc.balance}€`;
};
//Updating the UI Via the values
const updateUI = function (acc) {
  //display movements
  displayMovement(acc.movements);
  //display balance
  calcDisplayBalance(acc);
  //display Summery
  calcDisplaySummery(acc);
}
//Creating Username incase of new acc
const createUserNames = accs => {
  accs.forEach(acc => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

//Event Handlers 
//Login handler
btnLogin.addEventListener('click',e => {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI && Welcome Message
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]
      }`;
    containerApp.style.opacity = 1;

    //Updating the UI
    updateUI(currentAccount)
  } else if (inputLoginPin.value === '' || inputLoginUsername.value === '') {
    alert('Pls Fill in the feilds😏😏')
  }else {
    containerApp.style.opacity = 0;
    alert('Account does not Exist ☹☹')
  }
  //clear input feild;
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
});

//Transfer Handler
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find((acc, i, arr) => {
    return acc.userName === inputTransferTo.value;
  });
  if (amount > 0 && reciverAcc && currentAccount.balance >= amount && reciverAcc ?.userName !== currentAccount.userName) {
    //Transfering
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);
    updateUI(currentAccount);
    //Updating the UI
  } else {
    alert(`Your input maybe incorrect or You're have Innsufficent Balance🥴🥴`)
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});
//Delete handler
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (currentAccount.userName === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)) {
    const index = accounts.findIndex((acc) => {
      return acc.userName === currentAccount.userName;
    });

    //Delete acc
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//Request Loan Event
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();

  const loan = Number(inputLoanAmount.value);
  if (loan > 0 && currentAccount.movements.some(mov => mov >= loan * 0.1)) {
    currentAccount.movements.push(loan);
    updateUI(currentAccount);
  } else {
    alert("You're Not Eligible for This Offer Nigga😋😋😉")
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

//Sorting the movements
let sorted = false;
btnSort.addEventListener('click',(e) => {
  e.preventDefault();

  displayMovement(currentAccount.movements,!sorted);
  sorted = !sorted;
});
//Chanllenge
/*
const checkDogs = function(arr1, arr2){
  const corrected = arr1.splice(1, 2);
  const ageData = corrected.concat(arr2);
  
  ageData.forEach((data, i) => {
    if(data < 3){
      console.log(`Dog number ${i + 1} is still a puppy 🐶 and is ${data} years old`);
    }else{
      console.log(`Dog number ${i + 1} is an adult 🦁, and is ${data} years old`);
    }
  });
};

// const julia = [9, 16, 6, 8, 3];

checkDogs([3, 5, 2, 12, 7], [10, 5, 6, 1, 4]);
// console.log(julia.slice(0));
*/

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
//splice
let arr = [2, 33, 38, 9, 9, 8, 36];
console.log(arr.splice(3));
console.log(arr);

const arr2 = ['j', 'i', 'h', 'k','a', 'w'];

// the reverse method
console.log(arr2);
console.log(arr2.reverse());
console.log(arr2);
//Concat method  
const letter = arr.concat(arr2);
console.log(letter);


//the forEach method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
movements.forEach((move, index, array) => {
  if(move > 0){
    console.log(`move ${index + 1}: You deposited ${move}`);
  }else{
    console.log(`move ${index + 1}: You withdrawed ${Math.abs(move)}`);
    console.log(array);
  }
});

const check = new Map([
  ['name', 'kene'],
  ['lastName', 'onwe'],
  ['age', 22]
]);
// console.log(check);

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function(value, key, map){
  console.log(`${key}: ${value}`);
});


//map filter and reduce method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;
// const moveToUsd = movements.map(mov => Math.trunc(mov * eurToUsd));
// console.log(movements);
// console.log(moveToUsd);

const movementNew = movements.map((mov, i, arr) => {
 return `move ${i + 1}: You ${mov > 0 ? 'deposite' : 'withdraw'} ${Math.abs(mov)}`
});
// console.log(movementNew);

// const user = 'Kenechukwu Josiah Onwe';

// console.log(accounts);

const deposit = movements.filter((mov) => mov > 0);
const withDrawal = movements.filter((mov) => mov < 0);
// console.log(deposit) ;
// console.log(withDrawal);

const balance = movements.reduce((acc, value, i, arr) => {
  return acc + value;
},0);
// console.log(balance);

const calcAverageHumanAge = (arr) => {
  const humanAge = arr.map(age => age <= 18 ? age * 4 : (age + 16) * 4);
  console.log(humanAge);
  const ave = humanAge.filter(age => {age >= 18}).reduce((acc, age, i, arr) => {
    return acc + age / arr.length;
  }, 0);
  return ave;
}
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));;
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));;


const totalUsd = movements.filter(mov => mov > 0).map((mov) => Math.trunc(mov * eurToUsd)).reduce((acc, mov) => {return acc + mov}, 0);


const calcAverageHumanAge = (arr) => {
  const humanAve = arr.map(age => age <= 2 ? age * 2 : (age + 16) * 4).filter(age => age >= 18).reduce((acc, age, i, arr) => acc + age / arr.length);
  return humanAve
}
console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//the find method
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

const account = accounts.find(acc => acc.owner === 'Kenechukwu Josiah Onwe');
console.log(account);

//the flat and flatMap method
const Movements = accounts.map(mov => mov.movements);
const allMovements = Movements.flat();
console.log(allMovements)
const totalMove = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(totalMove);

const TotalMove = accounts.flatmap()

//Sorting Method 
const owners = ['kene', 'onwe', 'uche', 'kosy', 'sister'];
console.log(owners.sort());

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const moves = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements.sort());

console.log(movements.sort((a, b) => b - a));

console.log(moves.sort((a, b) => {
  if (a > b) {
    return 1;
  }
  if (b > a) {
    return -1;
  }
}))
console.log(moves);


const y = Array.from({length: 8},() => "It worked");

console.log(y);
const newA = y.map((a,b) => {
  return `${b} ${a}`
});
console.log(newA);

const arrRandom = Array.from({length: 100},(_,i) => Math.round ((Math.random() * i)) + 1);
console.log(arrRandom);

labelBalance.addEventListener('click', (e) => {
  const labB = Array.from(document.querySelectorAll('.movements__value'));
  const myresult = labB.map(el => {
    return Number(el.textContent.replace('€',''))
  });
  console.log(myresult);
});


const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach((dog) => dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28));

//2.
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
if (dogSarah.curFood > dogSarah.recommendedFood) {
  console.log(`Sarah's dog eats ${Math.abs(dogSarah.recommendedFood - dogSarah.curFood)}kg more food than required`);
}

const ownersEatTooMuch = dogs.filter(dog => dog.curFood > dog.recommendedFood).map(dog => dog.owners).flat();
console.log(`${ownersEatTooMuch.join(' and ')} dogs Eat too little`);
const ownersEatTooLittle = dogs.filter(dog => dog.curFood < dog.recommendedFood).map(dog => dog.owners).flat();
console.log(`${ownersEatTooLittle.join(' and ')} dogs eat too much`);

const DogCorrect = dogs.some(dog => dog.curFood === dog.recommendedFood);
console.log(DogCorrect);

const DogOkay = dogs.some(dog => dog.curFood > (dog.recommendedFood * 0.90) && dog.curFood < (dog.recommendedFood *
1.10));
console.log(DogOkay);

const DogOkayArr = dogs.filter(dog => dog.curFood > (dog.recommendedFood * 0.90) && dog.curFood < (dog.recommendedFood *
  1.10));
console.log(DogOkayArr);

const DogCopy = dogs.slice().sort((a,b) => a.recommendedFood - b.recommendedFood);
console.log(DogCopy);
*/