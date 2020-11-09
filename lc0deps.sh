#install lc0 dependencies ( known to work on goorm.io )

sudo apt-get update -y
sudo apt-get install libopenblas-base -y
sudo apt-get install libstdc++6 -y
sudo add-apt-repository ppa:ubuntu-toolchain-r/test 
sudo apt-get update
sudo apt-get upgrade
sudo apt-get dist-upgrade
