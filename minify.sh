echo "" > assets/js/diversiteit.min.js
for f in $(ls assets/js/x3/*.js); do
        java -jar yuicompressor-2.4.8.jar $f -o out.js
        cat out.js >> assets/js/diversiteit.min.js
done;
java -jar yuicompressor-2.4.8.jar assets/js/diversiteit.js -o out.js
cat out.js >> assets/js/diversiteit.min.js
rm out.js

java -jar yuicompressor-2.4.8.jar assets/css/diversiteit.css -o assets/css/diversiteit.min.css
