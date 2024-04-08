## Description
The application is for learning languages (Polish, English, Interslavic). It combines an online dictionary with games similar to those found on Quizlet and utilizes the SuperMemo learning algorithm (modified version by ANKI).

The application utilizes Google Text-to-Speech for generating pronunciation of the stored words.

## Why?
During my final year of high school, I was preparing for the English final exam. I used three different applications to aid my studies: Diki for word lookup, Quizlet for learning, and Anki for keeping word memorized. This meant that for every new word, I had to input it three times, not to mention adding example sentences. It became tedious, and as a result, I often skip adding new words to my study list. I decided to change this by creating a simple application to simplify the process. Since I already planned to develop something substantial in React to test my frontend skills in a real project, it seemed like the perfect opportunity.

## Stack
- **Frontend**: Typescript + React.js + Redux + MUI + GSAP
- **Backend**: Typescript + Express.js + MongoDB

## Production use  
This application is not intended for daily use. I wrote it to improve my frontend skills. I am quite happy of the overall look of the application as well as the quality of the frontend code I wrote. However, the backend is a complete mess. I wrote it with zero knowledge of web application programming (it was my first experience with express.js), and it doesn't even have a single test. It likely contains numerous vulnerabilities. For this reason, I cannot guarantee that the data you enter into this application will not leak or be deleted.

## How to use it?
Do you want to test it? Check the working instance on http://sl.puragl.xyz

App is dockerized, so you can easily host your own instance:
1. Clone this repo:
```bash
git clone https://github.com/AmonDeShir/simple-learning.git
cd ./simple-learning
```

2. Create env file
```bash
mkdir ./backend/secret
cp ./backend/.env.example ./backend/secret/.env
```
3. Adjust ./backend/secret/.env file
4. Build docker image
```bash
docker compose build
```
5. Start app
```bash
docker compose up -d
```
6. Go to http://localhost to test your own instance of simple-learning.