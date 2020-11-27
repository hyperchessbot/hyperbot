echo "removing Wiki"
rm -rf Wiki
echo "cloning Wiki"
git clone https://github.com/hyperchessbot/hyperbot.wiki.git Wiki
echo "removing Wiki/.git"
rm -rf Wiki/.git
echo "updating file information"
node update.js
echo "copying explanation of files"
cp Wiki/explainfiles.md Wiki/Explanation-of-files.md
