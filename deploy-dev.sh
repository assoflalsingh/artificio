# !/bin/bash
# Get servers list:
set — f
# Variables from GitLab server:
string=$SERVER_DEV
echo "${string}"

# Iterate servers for deploy and pull last commit
# Careful with the ; https://stackoverflow.com/a/20666248/1057052
echo "Deploy project on server ${string}"
ssh ${string} "cd /home/ec2-user && git clone https://gitlab.com/artificio2020/front-end-react.git && cd front-end-react && npm install && npm build && cd build"