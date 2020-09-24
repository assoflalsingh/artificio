This is the front end for the artificio.ai app.

Clone the repo and `cd front-end-react`. Run the below scripts as per your need.

## Available Scripts

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.<br />

### `npm run build`

Builds the app for production to the `build` folder.<br />

Sample nginx config:
Copy the content from build directory to /var/www/example.com

server {
        listen 80;
        listen [::]:80;

        root /var/www/example.com;
        index index.html index.htm;

        server_name example.com www.example.com;

        location / {
                try_files $uri $uri/ /index.html;
        }
}