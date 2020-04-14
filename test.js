//引入
const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const config = require("./config.json");
//驅動
chrome.setDefaultService(
  new chrome.ServiceBuilder("bin/chromedriver.exe").build()
);
//瀏覽器設定
let options = new chrome.Options();
options.addArguments(["--headless", "--disable-extensions"]);


(async function example() {
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  try {
    //登入
    await driver.get("http://laravel.test/gogo");
    await driver.switchTo().alert().then(alert=>{
      return alert.accept();
    });
    await driver.switchTo().alert().then(alert=>{
      return alert.accept();
    }).catch(error=>{});

  } finally {
    await driver.quit();
  }
})();
