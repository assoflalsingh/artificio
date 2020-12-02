This is the front end for the artificio.ai app.

## Deploy the app to prod
```
# Clean up the server app dir

ssh -i aml.pem ec2-user@artificio.ai

cd /home/ec2-user

rm -rf app

mkdir app

# In a new terminal

git clone https://gitlab.com/artificio2020/front-end-react.git

cd front-end-react

npm install

npm build

cd build

scp -i aml.pem -pr * ec2-user@artificio.ai:/home/ec2-user/app


# Going back to SSH

ssh -i aml.pem ec2-user@artificio.ai

cd /var/www/artificio.ai/

sudo rm -rf *

sudo cp -R /home/ec2-user/app/* .

sudo chown -R nginx:nginx *

# If restart required.
sudo systemctl restart nginx.service

sudo systemctl status nginx.service

```

## nginx conf for aritificio.ai

```
[ec2-user@ip-10-0-1-13 ~]$ cat /etc/nginx/conf.d/artificio.ai.conf
server {
        listen 443 ssl;
        listen [::]:443;
	ssl_certificate /etc/ssl/certs/artificio.cert;
	ssl_certificate_key /etc/ssl/certs/artificio.key;

        root /var/www/artificio.ai;
        index index.html index.htm;

        server_name artificio.ai www.artificio.ai;

        location /ping {
                access_log off;
                return 200 'SUCCESS';
                add_header Content-Type text/html;
        }

        location / {
                try_files $uri $uri/ /index.html;
        }
}


server {
    listen 80;
    server_name artificio.ai www.artificio.ai;
    return 301 https://artificio.ai$request_uri;
}
```


## Available Scripts

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.<br />

### `npm run build`

Builds the app for production to the `build` folder.<br />