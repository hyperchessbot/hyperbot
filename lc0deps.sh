#!/bin/bash

echo "installing lc0deps"

sudo apt-get update -y

sudo apt-get install software-properties-common -y

sudo apt-get install libopenblas-base -y
sudo apt-get install libstdc++6 -y
sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get dist-upgrade -y

chmod +x lc0goorm/lc0
chmod +x serve.sh

echo "installing lc0deps done"

