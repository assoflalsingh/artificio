# !/bin/bash
# Get servers list:
set — f
# Variables from GitLab server:
string=$SERVER_DEV
echo "${string}"

# Iterate servers for deploy and pull last commit
# Careful with the ; https://stackoverflow.com/a/20666248/1057052
echo "Deploy project on server ${string}"
ssh ${string} "cd /home/ec2-user && rm -rf app && mkdir app && git clone https://gitlab.com/artificio2020/front-end-react.git && cd front-end-react && npm install && npm build && cd build && scp -i aml.pem -pr * ec2-user@artificio.ai:/home/ec2-user/app && cd /var/www/artificio.ai/app && sudo rm -rf * && sudo cp -R /home/ec2-user/app/* . && sudo chown -R nginx:nginx * && sudo systemctl restart nginx.service && sudo systemctl status nginx.service"