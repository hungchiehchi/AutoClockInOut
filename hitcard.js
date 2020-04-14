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
//時間
let today = new Date();
let ampm = today.getHours() >= 12 ? "PM" : "AM";
let todayString =
  today.getFullYear() +
  "-" +
  (today.getMonth() + 1).toString().padStart(2, 0) +
  "-" +
  today
    .getDate()
    .toString()
    .padStart(2, 0);
if (config.vacation.includes(todayString)) {
  process.exit();
}

(async function example() {
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  try {
    //登入
    await driver.get("http://120.108.221.71/eip/login.aspx");
    await driver
      .findElement(By.id("tb_eipea_account_emp_account"))
      .sendKeys(config.account);
    await driver
      .findElement(By.id("tb_eipea_password_emp_account"))
      .sendKeys(config.password);
    await driver.findElement(By.id("btn_login")).click();
    //打卡
    await driver.get(
      "http://120.108.221.71/EIP/humanly/data_transfer/hum_wkrecord_online.aspx"
    );
    switch (ampm) {
      case "AM": //上班
        $button = By.id(
          "ctl00_ContentPlaceHolder1_Button_humwr_amst_hum_wkrecord"
        );
        break;
      case "PM": //下班
        $button = By.id(
          "ctl00_ContentPlaceHolder1_Button_humwr_pmet_hum_wkrecord"
        );
        break;
      default:
        //離開
        await driver.quit();
        break;
    }
    await driver.findElement($button).click(); //點擊
    await driver
      .switchTo()
      .alert()
      .then(alert => {
        return alert.accept();
      })
      .catch(error => {}); //關彈跳視窗
    await driver
      .switchTo()
      .alert()
      .then(alert => {
        return alert.accept();
      })
      .catch(error => {}); //關彈跳視窗

    //結果
    let cell = await driver.findElement(
      By.css("#ctl00_ContentPlaceHolder1_Table_record")
    );
    console.log(today.toLocaleString());
    console.log(await cell.getText());
  } finally {
    await driver.quit();
  }
})();
