echo "removing Wiki"
rm -rf Wiki
echo "cloning Wiki"
git clone https://github.com/hyperchessbot/hyperbot.wiki.git Wiki
echo "removing Wiki/.git"
rm -rf Wiki/.git
